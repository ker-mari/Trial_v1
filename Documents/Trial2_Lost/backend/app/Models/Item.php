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
        'claimer_name',
        'claimer_grade',
        'claimer_id',
        'claim_date',
        'officer'
    ];

    protected $casts = [
        'is_valuable' => 'boolean',
        'date_time' => 'datetime',
        'claim_date' => 'datetime',
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
            // item_no now handled in controller for better transaction control
            if (empty($item->item_no)) {
                $item->item_no = 1; // Fallback, should be set in controller
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
