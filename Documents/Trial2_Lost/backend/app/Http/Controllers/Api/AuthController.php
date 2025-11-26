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

class AuthController extends Controller
{
    public function verifyPin(Request $request): JsonResponse
    {
        try {
            // Validate input
            $request->validate([
                'pin' => 'required|string|min:4|max:10'
            ]);

            $inputPin = trim($request->input('pin'));

            // Cache active pins for 10 minutes with hash map for faster lookup
            $pins = Cache::remember('active_pins_hash_map', 600, function () {
                return Pin::where('is_active', true)
                    ->select('id', 'pin_hash', 'user_name', 'is_admin')
                    ->get()
                    ->keyBy('id');
            });

            if ($pins->isEmpty()) {
                Log::error('No active pins found in database');
                // Clear cache and try to seed pins if none exist
                Cache::forget('active_pins_hash_map');
                $this->seedDefaultPins();
                $pins = Pin::where('is_active', true)
                    ->select('id', 'pin_hash', 'user_name', 'is_admin')
                    ->get()
                    ->keyBy('id');

                if ($pins->isEmpty()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Authentication system not configured'
                    ], 500);
                }
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

    private function seedDefaultPins()
    {
        try {
            $defaultPins = [
                [
                    'pin_hash' => Hash::make('847293'),
                    'user_name' => 'Mr. Guard 1',
                    'is_admin' => false,
                    'is_active' => true,
                ],
                [
                    'pin_hash' => Hash::make('562018'),
                    'user_name' => 'Ms. Guard 2',
                    'is_admin' => false,
                    'is_active' => true,
                ],
                [
                    'pin_hash' => Hash::make('391847'),
                    'user_name' => 'Admin User',
                    'is_admin' => true,
                    'is_active' => true,
                ],
            ];

            foreach ($defaultPins as $pinData) {
                Pin::firstOrCreate(
                    ['user_name' => $pinData['user_name']],
                    $pinData
                );
            }

            Log::info('Default pins seeded successfully');
        } catch (\Exception $e) {
            Log::error('Failed to seed default pins: ' . $e->getMessage());
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