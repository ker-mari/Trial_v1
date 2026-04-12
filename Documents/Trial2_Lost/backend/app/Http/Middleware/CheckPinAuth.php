<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CheckPinAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Allow CORS preflight requests to pass through without auth
        if ($request->isMethod('OPTIONS')) {
            return $next($request);
        }

        // Get auth token from custom header, standard Bearer token, or query string
        $authToken = $request->header('X-Auth-Token') 
            ?: $request->bearerToken() 
            ?: $request->query('token');

        if (!$authToken) {
            // If you see this in Render logs, the FRONTEND is failing to send the token
            Log::warning('CheckPinAuth: NO TOKEN IN REQUEST. Check frontend Axios setup.', [
                'url' => $request->fullUrl(),
                'headers' => $request->headers->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Authentication required. Please log in.'
            ], 401);
        }

        // Verify token exists in cache (session store) with fallback to database
        $sessionData = Cache::get('auth_token:' . $authToken);

        if (!$sessionData) {
            // If you see this in Render logs, the BACKEND CACHE is wiping the token
            Log::error('CheckPinAuth: Token received, but MISSING FROM CACHE. Check CACHE_DRIVER in .env', [
                'token' => $authToken,
                'cache_driver' => config('cache.default')
            ]);
        }
        
        // Fallback: check database if cache fails (for production stability)
        if (!$sessionData && strlen($authToken) === 32) {
            try {
                $prefix = Cache::getStore()->getPrefix();
                $dbSession = \Illuminate\Support\Facades\DB::table('cache')
                    ->where('key', $prefix . 'auth_token:' . $authToken)
                    ->where('expiration', '>', time())
                    ->value('value');
                if ($dbSession) {
                    $sessionData = is_string($dbSession) ? unserialize($dbSession) : $dbSession;
                    // Restore to cache
                    Cache::put('auth_token:' . $authToken, $sessionData, 1800);
                }
            } catch (\Exception $e) {
                // Ignore DB fallback errors if the cache table doesn't exist
            }
        }

        if (!$sessionData) {
            Log::warning('CheckPinAuth: Session expired or invalid token', ['token' => $authToken]);
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
