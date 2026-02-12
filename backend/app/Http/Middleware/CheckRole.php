<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    // CheckRole
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Check if user is authenticated
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401); // 401 is for Unauthenticated
        }
$user= request()->user();
        // 2. Check if user has one of the required roles
        // We use in_array for O(n) check, which is fine for small role lists
        if (! $user || ! $user->hasAnyRole($roles)) {           
             return response()->json([
                'message' => 'Access denied. Required roles: ' . implode(', ', $roles),
                'error' => 'FORBIDDEN_ROLE',
                'user_id' => $user?->id,
                'debug_info' => [
                    'required_roles' => $roles,
                    'user_roles' => $user?->getRoleNames(),
                ],
            ], 403); // 403 is for Unauthorized/Forbidden
        }

        return $next($request);
    }
}
