<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Spatie\Permission\Models\Role;

class AuthController  extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'status' => 'required|in:active,inactive,suspended,pending',
                'password' => 'required|string|min:8|confirmed',
            ]);




            $role_id = Role::where('name', 'student')->first()->id;


            if (!$role_id) {
                return response()->json([
                    'error' => 'Role not found',
                    'data' => $role_id
                ], 404);
            }


            $user = User::create([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'role_id' => $role_id,
                'status' => $validated['status'],
                'password' => $validated['password'],
            ]);

            // This is where the Spatie magic happens
            $user->assignRole('student');

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user->load('roles') // Load roles to see them in the response
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Registration failed', 
            'message' => $e->getMessage()], 
            500);
        }
    }

    /**

    /**
     * Update the specified resource in storage.
     */
    // public function login(Request $request)
    // {
    //     try {
    //         $credentials = $request->validate([
    //             'email' => 'required|string|email',
    //             'password' => 'required|string',
    //         ]);

    //         $user = User::where('email', $credentials['email'])->first();

    //         if (!$user || !\Hash::check($credentials['password'], $user->password)) {
    //             return response()->json(['error' => 'Invalid credentials'], 401);
    //         }

    //         // Create token with abilities (Optional but useful for Sanctum)
    //         $token = $user->createToken('auth_token')->plainTextToken;
    //         $user->roles->makeHidden('pivot');


    //         return response()->json([
    //             'message' => 'Login successful',
    //             'access_token' => $token,
    //             'data' => $user,
    //         ], 200);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Login failed', 'message' => $e->getMessage()], 500);
    //     }
    // }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !\Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $user->roles->makeHidden('pivot');

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'data' => $user,
        ], 200);
    }
}