<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class History extends Model
{
    protected $table = 'history';

    protected $fillable = [
        'item_id',
        'pending_edit_id',
        'date',
        'code',
        'item_name',
        'owner',
        'status',
        'officer'
    ];

    protected $casts = [
        'date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Ensure timestamps are included in JSON serialization
    protected $visible = [
        'id',
        'item_id',
        'date',
        'code',
        'item_name',
        'owner',
        'status',
        'officer',
        'created_at',
        'updated_at'
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function rejectionComment()
    {
        return $this->hasOne(RejectionComment::class, 'item_id', 'item_id')
                    ->where('pending_edit_id', $this->pending_edit_id ?? 0)
                    ->latest();
    }

    public static function createRecord($item, $action, $officer = 'System', $owner = null)
    {
        return self::create([
            'item_id' => $item->id,
            'date' => now()->toDateString(),
            'code' => strtoupper(substr($action, 0, 1)),
            'item_name' => $item->category . ' - ' . substr($item->description, 0, 50),
            'owner' => $owner,
            'status' => $item->status,
            'officer' => $officer
        ]);
    }
}