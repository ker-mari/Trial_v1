<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if is_admin flag is present in the request
        // This should be set by the frontend after PIN verification
        $isAdmin = $request->header('X-Is-Admin') === 'true' || 
                   $request->input('is_admin') === true ||
                   $request->input('is_admin') === 'true';

        if (!$isAdmin) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        return $next($request);
    }
}

