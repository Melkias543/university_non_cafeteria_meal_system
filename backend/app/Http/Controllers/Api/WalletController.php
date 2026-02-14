<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    /**
     * Display a listing of the resource.
     */


    public function showByBalanceToStudent(Request $request)
    {
        try {
            $userId = $request->user()->id;

            // Fetch wallet if it exists
            $wallet = Wallet::where('user_id', $userId)->first();

            return response()->json([
                'success' => true,
                'balance' => $wallet ? $wallet->balance : 0, // 0 if wallet missing
            ], 200);
        } catch (\Exception $e) {
            // Return clean error instead of 500 crash
            return response()->json([
                'success' => false,
                'message' => 'Could not retrieve wallet balance.',
                'error' => $e->getMessage() // Remove in production for security
            ], 500);
        }
    }




    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
