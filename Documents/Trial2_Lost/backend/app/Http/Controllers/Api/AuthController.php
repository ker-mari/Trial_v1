<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Verify a user's PIN and issue a temporary authentication token.
     */
    public function verifyPin(Request $request): JsonResponse
    {
        $request->validate([
            'pin' => 'required|string|min:4|max:10'
        ]);

        $ipKey = 'verify-pin:' . $request->ip();

        // Limit to 5 attempts per minute
        if (RateLimiter::tooManyAttempts($ipKey, 5)) {
            return response()->json([
                'success' => false,
                'message' => 'Too many attempts. Please try again later.'
            ], 429);
        }

        RateLimiter::hit($ipKey, 60); // 60 seconds cooldown per failed attempt

        $inputPin = $request->input('pin');

        // Fetch active pins — in production, better to have indexed searchable fields
        $pins = Pin::where('is_active', true)->get();

        foreach ($pins as $pinRecord) {
            if (Hash::check($inputPin, $pinRecord->pin_hash)) {

                $authToken = $this->createAuthToken($pinRecord);

                Log::info('PIN verified', [
                    'user' => $pinRecord->user_name,
                    'ip' => $request->ip(),
                ]);

                return response()->json([
                    'success' => true,
                    'data' => [
                        'user_name' => $pinRecord->user_name,
                        'is_admin' => $pinRecord->is_admin,
                        'auth_token' => $authToken,
                        'expires_in' => 1800, // 30 minutes
                    ],
                    'message' => 'PIN verified successfully'
                ]);
            }
        }

        // Run a dummy hash check to reduce timing attack risk
        Hash::check($inputPin, '$2y$10$' . str_repeat('a', 53));

        Log::warning('Failed PIN attempt', [
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Invalid PIN'
        ], 401);
    }

    /**
     * Log the user out by invalidating their cached token.
     */
    public function logout(Request $request): JsonResponse
    {
        $authToken = $request->header('X-Auth-Token');

        if ($authToken && Cache::has('auth_token:' . $authToken)) {
            Cache::forget('auth_token:' . $authToken);

            Log::info('User logged out', [
                'token' => $authToken,
                'ip' => $request->ip(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Helper to create and cache a new authentication token.
     */
    private function createAuthToken(Pin $pinRecord): string
    {
        $authToken = Str::random(64);

        Cache::put('auth_token:' . $authToken, [
            'user_name' => $pinRecord->user_name,
            'is_admin' => $pinRecord->is_admin,
            'pin_id' => $pinRecord->id,
            'created_at' => now(),
        ], now()->addMinutes(30));

        return $authToken;
    }
}
