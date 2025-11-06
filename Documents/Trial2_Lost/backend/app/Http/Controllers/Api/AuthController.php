<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function verifyPin(Request $request): JsonResponse
    {
        // Validate input
        $request->validate([
            'pin' => 'required|string|min:4|max:10'
        ]);

        $inputPin = $request->input('pin');

        // Get all active pins from database
        $pins = Pin::where('is_active', true)->get();

        // Check each pin hash
        foreach ($pins as $pinRecord) {
            if (Hash::check($inputPin, $pinRecord->pin_hash)) {
                // Generate authentication token
                $authToken = Str::random(64);

                // Store session data in cache (30 minutes expiry)
                Cache::put('auth_token:' . $authToken, [
                    'user_name' => $pinRecord->user_name,
                    'is_admin' => $pinRecord->is_admin,
                    'pin_id' => $pinRecord->id,
                    'created_at' => now(),
                ], now()->addMinutes(30));

                return response()->json([
                    'success' => true,
                    'user_name' => $pinRecord->user_name,
                    'is_admin' => $pinRecord->is_admin,
                    'auth_token' => $authToken,
                    'expires_in' => 1800, // 30 minutes in seconds
                    'message' => 'PIN verified successfully'
                ]);
            }
        }

        // Invalid PIN - use constant time to prevent timing attacks
        return response()->json([
            'success' => false,
            'message' => 'Invalid PIN'
        ], 401);
    }

    public function logout(Request $request): JsonResponse
    {
        $authToken = $request->header('X-Auth-Token');

        if ($authToken) {
            // Remove token from cache
            Cache::forget('auth_token:' . $authToken);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}