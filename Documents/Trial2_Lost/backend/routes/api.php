<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ApprovalController;
use Illuminate\Support\Facades\Artisan;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/run-migrations', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        
        return response()->json([
            'success' => true,
            'message' => 'Migrations ran successfully!',
            'output' => Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// Authentication routes (public - no auth required)
Route::post('auth/verify-pin', [AuthController::class, 'verifyPin'])->middleware('throttle:10,1');
Route::post('auth/logout', [AuthController::class, 'logout'])->middleware('throttle:10,1');

// Database test route (public for testing)
Route::get('test-db', function () {
    try {
        $count = \App\Models\Item::count();
        return response()->json([
            'success' => true,
            'message' => 'Database connected successfully',
            'items_count' => $count
        ]);
    } catch (\Exception $e) {
        // Log the detailed error for debugging
        Log::error('Database connection test failed: ' . $e->getMessage());

        // Return sanitized error message (hide details in production)
        return response()->json([
            'success' => false,
            'message' => config('app.debug')
                ? 'Database connection failed: ' . $e->getMessage()
                : 'Database connection failed. Please check server logs.'
        ], 500);
    }
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('items', ItemController::class)->middleware('throttle:60,1');
    Route::post('items/{item}/claim', [ItemController::class, 'claim'])->middleware('throttle:10,1');
    Route::get('items/{item}/history', [ItemController::class, 'getHistory'])->middleware('throttle:60,1');
    Route::get('items/{item}/rejection-comments', [ItemController::class, 'getRejectionComments'])->middleware('throttle:60,1');
    Route::get('items-to-be-cleared', [ItemController::class, 'itemsToBeCleared'])->middleware('throttle:60,1');
    Route::get('history', [ItemController::class, 'getAllHistory'])->middleware('throttle:60,1');

    // Non-admin users can submit edits for approval
    Route::post('pending-edits', [ApprovalController::class, 'store'])->middleware('throttle:10,1');

    // Admin-only routes
    Route::middleware(['admin', 'throttle:30,1'])->group(function () {
        Route::get('pending-edits', [ApprovalController::class, 'index']);
        Route::post('pending-edits/{id}/approve', [ApprovalController::class, 'approve']);
        Route::post('pending-edits/{id}/reject', [ApprovalController::class, 'reject']);
    });
});