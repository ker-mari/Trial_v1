<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pin;
use Illuminate\Support\Facades\Hash;

class PinSeeder extends Seeder
{
    public function run(): void
    {
        Pin::create([
            'pin_hash' => Hash::make('391847'),
            'user_name' => 'Mrs. Laura Sabillon',
            'is_admin' => true,
            'is_active' => true
        ]);

        Pin::create([
            'pin_hash' => Hash::make('562018'),
            'user_name' => 'Bro. Ed',
            'is_admin' => false,
            'is_active' => true
        ]);

        Pin::create([
            'pin_hash' => Hash::make('749263'),
            'user_name' => 'Bro. Ramon',
            'is_admin' => false,
            'is_active' => true
        ]);
    }
}