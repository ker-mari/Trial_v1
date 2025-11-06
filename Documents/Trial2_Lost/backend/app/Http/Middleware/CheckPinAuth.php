<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;

class CheckPinAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get auth token from header
        $authToken = $request->header('X-Auth-Token');

        if (!$authToken) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required. Please log in.'
            ], 401);
        }

        // Verify token exists in cache (session store)
        $sessionData = Cache::get('auth_token:' . $authToken);

        if (!$sessionData) {
            return response()->json([
                'success' => false,
                'message' => 'Session expired. Please log in again.'
            ], 401);
        }

        // Attach user data to request for use in controllers
        $request->merge([
            'auth_user_name' => $sessionData['user_name'],
            'auth_is_admin' => $sessionData['is_admin'],
        ]);

        return $next($request);
    }
}

