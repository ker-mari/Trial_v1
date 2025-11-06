<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingEdit extends Model
{
    protected $fillable = [
        'item_id',
        'user_name',
        'edit_type',
        'original_data',
        'new_data',
        'status'
    ];

    protected $casts = [
        'original_data' => 'array',
        'new_data' => 'array'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}