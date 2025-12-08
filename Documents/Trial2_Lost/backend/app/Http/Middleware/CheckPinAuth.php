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

        // Verify token exists in cache (session store) with fallback to database
        $sessionData = Cache::get('auth_token:' . $authToken);
        
        // Fallback: check database if cache fails (for production stability)
        if (!$sessionData && strlen($authToken) === 32) {
            $sessionData = \Illuminate\Support\Facades\DB::table('cache')
                ->where('key', 'auth_token:' . $authToken)
                ->where('expiration', '>', time())
                ->value('value');
            if ($sessionData) {
                $sessionData = unserialize($sessionData);
                // Restore to cache
                Cache::put('auth_token:' . $authToken, $sessionData, 1800);
            }
        }

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

