<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\Wallet;
use App\Models\Deposit;
use App\Models\Transaction;
use App\Models\SystemLog;

class DepositController extends Controller
{
    /**
     * List deposits (student sees own, admin sees all)
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $deposits = $user->role === 'student'
            ? Deposit::where('user_id', $user->id)->latest()->paginate(10)
            : Deposit::latest()->paginate(10); // admin can see all

        return response()->json([
            'success' => true,
            'data'    => $deposits
        ]);
    }

    /**
     * Show single deposit
     */
    public function show(Deposit $deposit)
    {
        return response()->json([
            'success' => true,
            'data'    => $deposit
        ]);
    }

    /**
     * Store new deposit
     */
    public function topUp(Request $request,$user)
    {
        $validated = $request->validate([
            'amount'  => 'required|numeric|min:0.01',
            'month'   => 'nullable|date',
        ]);

        try {
            $deposit = DB::transaction(function () use ($validated, $request,$user) {
                // $user = User::findOrFail($validated['user_id']);

                // 1️⃣ Update Wallet
                $wallet = Wallet::firstOrCreate(
                    ['user_id' => $user],
                    ['balance' => 0]
                );
                $wallet->balance += $validated['amount'];
                $wallet->save();

                // 2️⃣ Create Deposit Record
                $deposit = Deposit::create([
                    'user_id' => $user,
                    'amount'  => $validated['amount'],
                    'month'   => $validated['month'] ?? now()->format('Y-m-d'),
                ]);

                // 3️⃣ Create Transaction Record
                Transaction::create([
                    'user_id'       => $user,
                    'order_id'      => null,
                    'type'          => 'deposit',
                    'amount'        => $validated['amount'],
                    'balance_after' => $wallet->balance,
                ]);

                // 4️⃣ System Log
                SystemLog::create([
                    'user_id'     => $request->user()->id,
                    'action'      => 'deposit_created',
                ]);

                return  $deposit;
            });

            return response()->json([
                'success' => true,
                'message' => 'Deposit successful and wallet updated',
                'data'    => $deposit
            ], 201);
        } catch (\Throwable $e) {
            Log::error("Deposit Failed: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'Deposit failed'
            ], 400);
        }
    }
}
