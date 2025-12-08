<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RejectionComment extends Model
{
    protected $fillable = [
        'item_id',
        'pending_edit_id',
        'rejection_reason',
        'rejected_by'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function pendingEdit(): BelongsTo
    {
        return $this->belongsTo(PendingEdit::class);
    }
}

