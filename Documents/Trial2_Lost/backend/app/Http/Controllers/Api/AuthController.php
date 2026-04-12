<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Verify the PIN provided by the mobile app and return a session token.
     */
    public function verifyPin(Request $request): JsonResponse
    {
        try {
            // 1. Validate input
            $request->validate([
                'pin' => 'required|string|min:4|max:10'
            ]);

            $inputPin = trim($request->input('pin'));

            // 2. Fetch or Cache active pins
            // Using a hash map to avoid database hits on every login attempt
            $pins = Cache::remember('active_pins_hash_map', 600, function () {
                return Pin::where('is_active', true)
                    ->select('id', 'pin_hash', 'user_name', 'is_admin')
                    ->get();
            });

            if ($pins->isEmpty()) {
                Log::error('Auth: No active pins found in database.');
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication system not configured'
                ], 500);
            }

            // 3. Verify PIN against hashed records
            $validPin = null;
            foreach ($pins as $pinRecord) {
                if (empty($pinRecord->pin_hash)) continue;

                if (Hash::check($inputPin, $pinRecord->pin_hash)) {
                    $validPin = $pinRecord;
                    break;
                }
            }

            if ($validPin) {
                // 4. Generate a unique session token
                $authToken = Str::random(64);

                // 5. Store session in Cache (Expires in 30 minutes)
                // The 'pin.auth' middleware should look for 'auth_token:' . $token
                Cache::put('auth_token:' . $authToken, [
                    'user_name' => $validPin->user_name,
                    'is_admin'  => $validPin->is_admin,
                    'pin_id'    => $validPin->id,
                ], 1800);

                Log::info("Auth: User {$validPin->user_name} verified successfully.");

                return response()->json([
                    'success'    => true,
                    'user_name'  => $validPin->user_name,
                    'is_admin'   => $validPin->is_admin,
                    'auth_token' => $authToken, // Mobile app must save this!
                    'expires_in' => 1800,
                    'message'    => 'PIN verified successfully'
                ]);
            }

            Log::warning("Auth: Invalid PIN attempt.");
            return response()->json([
                'success' => false,
                'message' => 'Invalid PIN'
            ], 401);
        } catch (\Exception $e) {
            Log::error('PIN verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Authentication system error'
            ], 500);
        }
    }

    /**
     * Remove the session token from cache to log the user out.
     */
    public function logout(Request $request): JsonResponse
    {
        // Check for the custom header we use in Mobile
        $authToken = $request->header('X-Auth-Token');

        if ($authToken) {
            Cache::forget('auth_token:' . $authToken);
            Log::info("Auth: Token {$authToken} invalidated (Logout).");
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}
