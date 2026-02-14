<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\QrLog;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders with items.
     */
    public function index()
    {
        $orders = Order::with('items.menu')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Store a newly created order with items.
     */
    // public function store(Request $request)

    // //   $table->uuid('id')->primary();
    // //         $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
    // //         $table->decimal('total_price', 10, 2);
    // //         $table->enum('status', ['pending', 'approved', 'rejected', 'used'])->default('pending');
    // //         $table->timestamps();
    // //  $table->uuid('id')->primary();
    // //         $table->uuid('order_id');
    // //         $table->uuid('menu_id');
    // //         $table->integer('quantity');
    // //         $table->decimal('price', 10, 2);
    // //         $table->timestamps();

    // //         $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
    // //         $table->foreign('menu_id')->references('id')->on('menus')->onDelete('cascade');
    // {
    //     $request->validate([
    //         'user_id' => 'required|exists:users,id',
    //         'items' => 'required|array|min:1',
    //         'total_price'=> 'required|numeric|min:0',
    //         'status' => 'required|in:pending,approved,rejected,used',
    //         'items.*.menu_id' => 'required|exists:menus,id',
    //         'items.*.quantity' => 'required|integer|min:1',
    //         'items.*.price' => 'required|numeric|min:0'
    //     ]);

    //     DB::beginTransaction();
    //     try {
    //         $totalPrice = collect($request->items)->sum(function ($item) {
    //             return $item['quantity'] * $item['price'];
    //         });

    //         $order = Order::create([
    //             'user_id' => $request->user_id,
    //             'total_price' => $totalPrice,
    //             'status' => 'pending'
    //         ]);

    //         foreach ($request->items as $item) {
    //             OrderItem::create([
    //                 'order_id' => $order->id,
    //                 'menu_id' => $item['menu_id'],
    //                 'quantity' => $item['quantity'],
    //                 'price' => $item['price']
    //             ]);
    //         }

    //         DB::commit();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Order created successfully',
    //             'data' => $order->load('items.menu')
    //         ], 201);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to create order',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }



    // public function store(Request $request)
    // {
    //                     $validated = $request->validate([
    //                         'total_price' => 'required|numeric|min:0',

    //                         'items' => 'required|array|min:1',
    //                         'items.*.id' => 'required|exists:menus,id',
    //                         'items.*.quantity' => 'required|integer|min:1',
    //                         'items.*.price' => 'required|numeric|min:0',
    //                     ]);

    //                     DB::beginTransaction();

    //                     try {

    //                         /*
    //                     OPTIONAL SECURITY CHECK
    //                     verifies frontend total matches items total
    //                     (recommended but can be removed if not needed)
    //                     */
    //                         $calculatedTotal = collect($validated['items'])->sum(function ($item) {
    //                             return $item['quantity'] * $item['price'];
    //                         });

    //                         error_log($calculatedTotal);

    //                         if ($calculatedTotal != $validated['total_price']) {
    //                             return response()->json([
    //                                 'success' => false,
    //                                 'message' => 'Total price mismatch'
    //                             ], 400);
    //                         }
    //                         $qrToken = (string) Str::uuid();
    //                         // ✅ create order
    //                         $order = Order::create([
    //                             'user_id' => auth()->id(),
    //                             'total_price' => $validated['total_price'],

    //                             'status' => 'pending', // default
    //                             'qr_code' => $qrToken,
    //                             'expires_at' => now()->addHours(2)
    //                         ]);

    //                         // ✅ insert items
    //                         foreach ($validated['items'] as $item) {
    //                             OrderItem::create([
    //                                 'order_id' => $order->id,
    //                                 'menu_id' => $item['id'],
    //                                 'quantity' => $item['quantity'],
    //                                 'price' => $item['price'],
    //                             ]);
    //                         }




    //                         SystemLog::create([
    //                             'user_id'     => $request->user()->id,
    //                             'action'      => 'order created',
    //                         ]);
    //                         DB::commit();


    //                         return response()->json([
    //                             'success' => true,
    //                             'message' => 'Order created successfully',
    //                             'data' => $order->load('items.menu')
    //                         ], 201);
    //                     } catch (\Throwable $e) {

    //                         DB::rollBack();

    //                         return response()->json([
    //                             'success' => false,
    //                             'message' => 'Order creation failed',
    //                             'error' => $e->getMessage()
    //                         ], 500);
    //                     }
    // }


    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'total_price' => 'required|numeric|min:0',
    //         'items' => 'required|array|min:1',
    //         'items.*.id' => 'required|exists:menus,id',
    //         'items.*.quantity' => 'required|integer|min:1',
    //         'items.*.price' => 'required|numeric|min:0',
    //     ]);

    //     DB::beginTransaction();

    //     try {
    //         // ✅ Optional frontend total verification
    //         $calculatedTotal = collect($validated['items'])->sum(fn($item) => $item['quantity'] * $item['price']);
    //         if ($calculatedTotal != $validated['total_price']) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Total price mismatch'
    //             ], 400);
    //         }

    //         // ✅ Generate QR token
    //         // If your table has an 'id' primary key
    //         $lastId = DB::table('orders')->max('qr_code') ?? 0;
    //         $qrToken = str_pad($lastId, 5, '0', STR_PAD_LEFT);
    //         // ✅ Generate QR image (PNG)
    //         $qrImage = QrCode::format('png')->size(300)->useBackend('gd')->generate($qrToken);

    //         // ✅ Save QR image to storage
    //         // $qrImagePath = "public/qrcodes/{$qrToken}.png";

    //         // Storage::put($qrImagePath, $qrImage);
    //         // $qrImageUrl = asset("storage/qrcodes/{$qrToken}.png");
    //         try {
    //             $qrImage = QrCode::format('png')->size(300)->useBackend('gd')->generate($qrToken);
    //             Storage::put("public/qrcodes/{$qrToken}.png", $qrImage);
    //         } catch (\Throwable $e) {
    //             dd($e->getMessage());
    //         return response()->json(['error' => 'Failed to generate QR code',
    //         "message"=> $e->getMessage()
    //         ], 500);
    //         }

    //         // ✅ Create order
    //         $order = Order::create([
    //             'user_id' => auth()->id(),
    //             'total_price' => $validated['total_price'],
    //             'status' => 'pending',
    //             'qr_code' => $qrToken,
    //             'qr_image_url' => $qrImageUrl,
    //             'expires_at' => now()->addHours(6),
    //         ]);

    //         // ✅ Insert order items
    //         foreach ($validated['items'] as $item) {
    //             OrderItem::create([
    //                 'order_id' => $order->id,
    //                 'menu_id' => $item['id'],
    //                 'quantity' => $item['quantity'],
    //                 'price' => $item['price'],
    //             ]);
    //         }

    //         // ✅ Log QR issuance
    //         QrLog::create([
    //             'order_id' => $order->id,
    //             'is_valid' => true,
    //                         ]);

    //         // ✅ System log
    //         SystemLog::create([
    //             'user_id' => auth()->id(),
    //             'action' => 'order created',
    //         ]);

    //         DB::commit();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Order created successfully',
    //             'data' => $order->load('items.menu'),
    //             'qr_code' => $qrToken,
    //             'qr_image' => $qrImageUrl
    //         ], 201);
    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Order creation failed',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
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
