<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthSession
{
    public function handle(Request $request, Closure $next)
    {
        if (!session('authenticated')) {
            return redirect()->route('pin');
        }
        
        // Check session timeout (30 seconds)
        $lastActivity = session('last_activity', 0);
        if (time() - $lastActivity > 30) {
            session()->flush();
            return redirect()->route('home');
        }
        
        // Update last activity
        session(['last_activity' => time()]);
        
        return $next($request);
    }
}