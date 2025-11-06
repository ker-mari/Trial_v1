<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Item extends Model
{
    protected $fillable = [
        'item_no',
        'category',
        'is_valuable',
        'image',
        'location',
        'date_time',
        'description',
        'status',
        'finder_name',
        'finder_grade',
        'finder_id',
        'officer'
    ];

    protected $casts = [
        'is_valuable' => 'boolean',
        'date_time' => 'datetime',
        'item_no' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function history(): HasMany
    {
        return $this->hasMany(History::class);
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', 'available');
    }

    public function scopeOlderThan(Builder $query, int $days): Builder
    {
        return $query->whereDate('date_time', '<=', now()->subDays($days));
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            // Auto-generate item_no as auto-incrementing integer
            if (empty($item->item_no)) {
                // Get max and increment - retry logic in controller handles race conditions
                $maxItemNo = static::max('item_no') ?? 0;
                $item->item_no = (int)$maxItemNo + 1;
            }
        });

        static::created(function ($item) {
            History::create([
                'item_id' => $item->id,
                'date' => now()->toDateString(),
                'code' => $item->is_valuable ? 'V' : 'L',
                'item_name' => $item->category,
                'owner' => $item->finder_name,
                'status' => 'Handed Over',
                'officer' => $item->officer ?? 'System'
            ]);
        });
    }
}
