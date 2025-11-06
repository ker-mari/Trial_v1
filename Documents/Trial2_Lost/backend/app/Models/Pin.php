<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pin extends Model
{
    protected $fillable = [
        'pin_hash',
        'user_name',
        'is_admin',
        'is_active'
    ];

    protected $casts = [
        'is_admin' => 'boolean',
        'is_active' => 'boolean'
    ];

    protected $hidden = [
        'pin_hash', // Never expose the hash in JSON responses
    ];
}