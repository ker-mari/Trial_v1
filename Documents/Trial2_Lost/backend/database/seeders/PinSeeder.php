<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PinSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing pins
        DB::table('pins')->truncate();

        // Create default pins with secure hashing
        // IMPORTANT: Change these PINs before deploying to production!
        // These are stronger 6-digit random PINs
        $pins = [
            [
                'pin_hash' => Hash::make('847293'),  // Guard 1 - 6 digit random
                'user_name' => 'Mr. Guard 1',
                'is_admin' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'pin_hash' => Hash::make('562018'),  // Guard 2 - 6 digit random
                'user_name' => 'Ms. Guard 2',
                'is_admin' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'pin_hash' => Hash::make('391847'),  // Admin - 6 digit random
                'user_name' => 'Admin User',
                'is_admin' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('pins')->insert($pins);

        $this->command->info('✅ Pins seeded successfully with hashed values!');
        $this->command->warn('⚠️  IMPORTANT: Change these default PINs in production!');
    }
}