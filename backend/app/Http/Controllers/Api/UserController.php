<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;


class UserController extends Controller
{
  

    /**
     * Display a listing of users.
     */
    public function index()
    {
        $currentUser = auth()->user();

        // Admin sees all users, others only themselves
        $users = $currentUser->hasRole('admin')
            ? User::with(['profile','wallet'])->latest()->get()
            : User::with(['profile','wallet'])->where('id', $currentUser->id)->get();

        return response()->json([
            'status' => true,
            'data' => $users
        ]);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $currentUser = auth()->user();

        if ($currentUser->id !== $user->id && !$currentUser->hasRole('admin')) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'status' => true,
            'data' => $user->load('profile')
        ]);
    }

    /**
     * Update user info + profile.
     */
 

    public function update(Request $request, User $user)
    {
        $currentUser = auth()->user();

        // Only admin or self can update
        if ($currentUser->id !== $user->id && !$currentUser->hasRole('admin')) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Validate input
        $validated = $request->validate([
            'full_name' => ['sometimes', 'string'],
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'status' => ['sometimes', 'string', Rule::in(['pending', 'reject', 'approve'])],
            'profile.phone' => ['nullable', 'string'],
            'profile.department' => ['nullable', 'string'],
            'profile.photo_url' => ['nullable', 'string'],
        ]);

        try {
            DB::transaction(function () use ($request, $user) {
                // Update user fields
                $user->update($request->only(['full_name', 'email', 'status']));

                // Update or create profile
                if ($request->has('profile')) {
                    $user->profile()->updateOrCreate(
                        ['user_id' => $user->id],
                        $request->input('profile')
                    );
                }
            });

            return response()->json([
                'status' => true,
                'message' => 'User updated successfully',
                'data' => $user->load('profile')
            ]);
        } catch (\Exception $e) {
            // Rollback happens automatically if an exception occurs
            return response()->json([
                'status' => false,
                'message' => 'Update failed: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Change user status (admin only).
     */
    public function changeUserStatus(Request $request, User $user)
    {
        $request->validate([
            'status' => 'required|in:pending,active,approved,rejected',
        ]);


        $user->update(['status' => $request->status]);

        return response()->json([
            'status' => true,
            'message' => "User status updated to {$request->status}",
            'data' => $user
        ]);
    }

    /**
     * Remove the specified user (admin only).
     */
    public function destroy(User $user)
    {
        $user->delete(); // cascade profile delete

        return response()->json([
            'status' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}
