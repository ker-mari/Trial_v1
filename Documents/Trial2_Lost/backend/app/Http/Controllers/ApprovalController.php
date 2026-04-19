<?php

namespace App\Http\Controllers;

use App\Models\PendingEdit;
use App\Models\Item;
use App\Models\RejectionComment;
use Illuminate\Http\Request;

class ApprovalController extends Controller
{
    public function index()
    {
        $pendingEdits = PendingEdit::where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->select(['id', 'user_name', 'created_at', 'original_data', 'new_data'])
            ->get();

        return response()->json($pendingEdits);
    }

    public function approve(Request $request, $id)
    {
        $pendingEdit = PendingEdit::findOrFail($id);

        // Validate new_data before applying
        $allowedFields = ['category', 'location', 'description', 'date_time', 'is_valuable', 'image', 'status'];
        $validatedData = [];

        foreach ($pendingEdit->new_data as $key => $value) {
            // Only allow whitelisted fields
            if (!in_array($key, $allowedFields)) {
                return response()->json([
                    'success' => false,
                    'message' => "Invalid field: {$key}"
                ], 400);
            }

            // Validate each field
            switch ($key) {
                case 'category':
                case 'location':
                case 'description':
                    if (!is_string($value) || strlen($value) > 1000) {
                        return response()->json([
                            'success' => false,
                            'message' => "Invalid value for {$key}"
                        ], 400);
                    }
                    $validatedData[$key] = $value;
                    break;

                case 'date_time':
                    // Validate date format
                    if (!strtotime($value)) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Invalid date_time format'
                        ], 400);
                    }
                    $validatedData[$key] = $value;
                    break;

                case 'is_valuable':
                    $validatedData[$key] = (bool) $value;
                    break;

                case 'status':
                    if (!in_array($value, ['available', 'claimed'])) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Invalid status value'
                        ], 400);
                    }
                    $validatedData[$key] = $value;
                    break;

                case 'image':
                    // Skip heavy image validation during approval
                    // Image was already validated when first submitted
                    // Accept: null, empty string, emoji, or base64 data URI
                    if ($value !== null && $value !== '' && !empty($value)) {
                        // Check if it's a base64 data URI (for new uploads)
                        $isBase64 = preg_match('/^data:image\/(jpeg|jpg|png|webp);base64,/', $value);
                        // Check if it's a single emoji or short string (for existing items)
                        $isEmoji = mb_strlen($value) <= 10;

                        if (!$isBase64 && !$isEmoji) {
                            return response()->json([
                                'success' => false,
                                'message' => 'Invalid image format'
                            ], 400);
                        }
                    }
                    $validatedData[$key] = $value;
                    break;
            }
        }

        // Apply the validated changes to the item
        $item = Item::findOrFail($pendingEdit->item_id);
        $item->update($validatedData);

        // Mark as approved
        $pendingEdit->update(['status' => 'approved']);

        // Log approval in history with authenticated user
        \App\Models\History::create([
            'item_id' => $item->id,
            'date' => now()->toDateString(),
            'code' => $item->is_valuable ? 'V' : 'L',
            'item_name' => $item->category,
            'owner' => $pendingEdit->user_name,
            'status' => 'Edit Approved',
            'officer' => $request->input('auth_user_name', 'Admin')
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Edit approved successfully'
        ]);
    }

    public function reject(Request $request, $id)
    {
        $pendingEdit = PendingEdit::findOrFail($id);
        $pendingEdit->update(['status' => 'rejected']);

        // Get the item for history logging
        $item = Item::findOrFail($pendingEdit->item_id);

        // Save rejection comment if provided
        $rejectionReason = $request->input('comments', '');
        if (!empty($rejectionReason)) {
            RejectionComment::create([
                'item_id' => $item->id,
                'pending_edit_id' => $pendingEdit->id,
                'rejection_reason' => $rejectionReason,
                'rejected_by' => $request->input('auth_user_name', 'Admin')
            ]);
        }

        // Log rejection in history with authenticated user
        \App\Models\History::create([
            'item_id' => $item->id,
            'pending_edit_id' => $pendingEdit->id,
            'date' => now()->toDateString(),
            'code' => $item->is_valuable ? 'V' : 'L',
            'item_name' => $item->category,
            'owner' => $pendingEdit->user_name,
            'status' => 'Edit Rejected',
            'officer' => $request->input('auth_user_name', 'Admin')
        ]);

        return response()->json(['message' => 'Edit rejected']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'user_name' => 'required|string|max:100',
            'edit_type' => 'required|string|in:update,status_change',
            'original_data' => 'required|array',
            'new_data' => 'required|array'
        ]);

        // Validate that new_data only contains allowed fields
        $allowedFields = ['category', 'location', 'description', 'date_time', 'is_valuable', 'image', 'status'];
        foreach (array_keys($validated['new_data']) as $field) {
            if (!in_array($field, $allowedFields)) {
                return response()->json([
                    'success' => false,
                    'message' => "Invalid field in new_data: {$field}"
                ], 400);
            }
        }

        $pendingEdit = PendingEdit::create([
            'item_id' => $validated['item_id'],
            'user_name' => $validated['user_name'],
            'edit_type' => $validated['edit_type'],
            'original_data' => $validated['original_data'],
            'new_data' => $validated['new_data'],
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'data' => $pendingEdit,
            'message' => 'Edit submitted for approval'
        ]);
    }
}