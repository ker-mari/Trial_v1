<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function verifyPin(Request $request): JsonResponse
    {
        try {
            // Validate input without throwing exceptions
            $validator = Validator::make($request->all(), [
                'pin' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'PIN is required'
                ], 422);
            }

            $inputPin = trim((string) $request->input('pin'));

            if (strlen($inputPin) < 4 || strlen($inputPin) > 10) {
                return response()->json([
                    'success' => false,
                    'message' => 'PIN must be between 4 and 10 characters'
                ], 422);
            }

            // Cache active pins for 10 minutes with hash map for faster lookup
            $pins = Cache::remember('active_pins_hash_map', 600, function () {
                return Pin::where('is_active', true)
                    ->select('id', 'pin_hash', 'user_name', 'is_admin')
                    ->get()
                    ->keyBy('id');
            });

            if ($pins->isEmpty()) {
                Log::error('No active pins found in database');
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication system not configured'
                ], 500);
            }

            // Fast hash verification with early exit
            $validPin = null;
            foreach ($pins as $pinRecord) {
                if (empty($pinRecord->pin_hash)) continue;
                
                if (Hash::check($inputPin, $pinRecord->pin_hash)) {
                    $validPin = $pinRecord;
                    break;
                }
            }
            
            if ($validPin) {
                // Generate authentication token
                $authToken = Str::random(32); // Shorter token for faster generation

                // Store session data in cache (30 minutes expiry)
                Cache::put('auth_token:' . $authToken, [
                    'user_name' => $validPin->user_name,
                    'is_admin' => $validPin->is_admin,
                    'pin_id' => $validPin->id,
                ], 1800); // Direct seconds instead of Carbon

                return response()->json([
                    'success' => true,
                    'user_name' => $validPin->user_name,
                    'is_admin' => $validPin->is_admin,
                    'auth_token' => $authToken,
                    'token' => $authToken,
                    'access_token' => $authToken,
                    'expires_in' => 1800,
                    'message' => 'PIN verified successfully'
                ]);
            }

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