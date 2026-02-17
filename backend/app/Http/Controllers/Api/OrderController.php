<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\QrLog;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders with items.
     */



    public function downloadQR($orderId)
    {

        // Find order by QR code
        $order = Order::where('qr_code', $orderId)->firstOrFail();

        // Extract filename from URL if needed
        $filename = $order->qr_code_filename ?? basename($order->qr_image_url);

        // Full path to file
        $path = public_path('storage/qrcodes/' . $filename);

        if (!file_exists($path)) {
            return response()->json(['message' => 'QR code file not found'], 404);
        }

        return response()->download($path, $filename);
    }






    public function scan(Request $request)
    {
        $request->validate([
            'qr_code' => 'required'
        ]);

        $order = Order::where('qr_code', $request->qr_code)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid QR Code'
            ], 404);
        }

        // Already used?
        if ($order->status === 'used') {
            return response()->json([
                'success' => false,
                'message' => 'This Order is already used'
            ], 400);
        }

        // Expired?
        if ($order->status === 'expired') {
            return response()->json([
                'success' => false,
                'message' => 'QR expired'
            ], 400);
        }

        // ✅ Mark as completed
        $order->update([
            'status' => 'used',
            'used_at' => now(),
        ]);

        SystemLog::create([
            'user_id' => auth()->id(),
            'action' => 'order used',
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Order completed successfully',
            'order' => $order
        ]);
    }








    public function myOrder($user_id){
    $orders = Order::with('items.menu')
    ->where('user_id', $user_id)
    ->latest()
    ->get();

    return response()->json([
        'success' => true,
        'data' => $orders
    ]);

}

    public function index()
    {
        $orders = Order::with(['user', 'items.menu'])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'total_price' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            // 1️⃣ Total Price Verification
            $calculatedTotal = collect($validated['items'])
                ->sum(fn($item) => (int)$item['quantity'] * (float)$item['price']);

            if (abs($calculatedTotal - $validated['total_price']) > 0.01) {
                return response()->json(['success' => false, 'message' => 'Total price mismatch'], 400);
            }
            // Get wallet balance safely
            $wallet = auth()->user()->wallet;

            $wallet_balance = $wallet->balance ?? 0;

            // Check if balance is sufficient
            if ($wallet_balance < $calculatedTotal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient wallet balance'
                ], 402);
            }

            // Deduct total and update wallet
            $wallet->update([
                'balance' => $wallet_balance - $calculatedTotal
            ]);
            // 2️⃣ QR Token Logic (10-digit)
            $lastQr = DB::table('orders')->max('qr_code');
            $nextNumber = $lastQr ? ((int)$lastQr + 1) : 1;
            $qrToken = str_pad($nextNumber, 10, '0', STR_PAD_LEFT); // e.g., "0000000001"

            // 3️⃣ Generate QR SVG
            $qrFileName = "qrcodes/{$qrToken}.svg";
            $qrData = [
                'qr_code'    => $qrToken,
                'order_id'   => $order->id ?? 'TEMP_ID', // if order exists
                'user_id'    => auth()->id() ?? $request->user_id,
                'total_price' => $validated['total_price'],
                'expires_at' => now()->addHours(6)->toDateTimeString(),
                // add anything else you want
            ];

            // Convert to JSON string
            $qrJson = json_encode($qrData);

            $qrImage = QrCode::format('svg')->size(300)->generate($qrJson);
            Storage::disk('public')->put($qrFileName, $qrImage);

            $qrImageUrl = Storage::url($qrFileName); // e.g., /storage/qrcodes/0000000001.svg

            // 4️⃣ Create Order
            $order = Order::create([
                'user_id'      => auth()->id() ?? $request->user_id,
                'total_price'  => $validated['total_price'],
                'status'       => 'pending',
                'qr_code'      => $qrToken,
                'qr_image_url' => $qrImageUrl, // store path directly
                'expires_at'   => now()->addHours(6),
            ]);

            // 5️⃣ Insert Items
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_id'  => $item['id'],
                    'quantity' => $item['quantity'],
                    'price'    => $item['price'],
                ]);
            }

            // 6️⃣ Logging
            QrLog::create(['order_id' => $order->id, 'is_valid' => true]);
            SystemLog::create(['user_id' => auth()->id(), 'action' => 'order created']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data'    => $order->load('items.menu'),
                'qr_url'  => $qrImageUrl
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Order creation failed',
                'error'   => $e->getMessage(),
                'line'    => $e->getLine()
            ], 500);
        }
    }

    /**
     * Display a specific order with items.
     */
    public function show(string $id)
    {
        $order = Order::with('items.menu')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Update order status (only status update for simplicity).
     */
    public function update(Request $request, string $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:pending,approved,rejected,used'
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data' => $order
        ]);
    }

    /**
     * Delete an order (cascades to items automatically).
     */
    public function destroy(string $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully'
        ]);
    }
}
