<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class PinSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->environment('production')) {
            $this->command->warn('⚠️  Skipping PinSeeder in production for safety.');
            return;
        }

        if (!Schema::hasTable('pins')) {
            $this->command->error('❌ Table "pins" does not exist.');
            return;
        }

        DB::table('pins')->truncate();

        $pins = [
            [
                'pin_hash' => Hash::make(env('PIN_GUARD1', '847293')),
                'user_name' => 'Mr. Guard 1',
                'is_admin' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'pin_hash' => Hash::make(env('PIN_GUARD2', '562018')),
                'user_name' => 'Ms. Guard 2',
                'is_admin' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'pin_hash' => Hash::make(env('PIN_ADMIN', '391847')),
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
