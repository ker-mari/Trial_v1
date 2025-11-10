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
        if (!Schema::hasTable('pins')) {
            $this->command->error('❌ Table "pins" does not exist.');
            return;
        }

        // Check if pins already exist
        $existingPins = DB::table('pins')->where('is_active', true)->count();
        if ($existingPins > 0) {
            $this->command->info('✅ Active pins already exist, skipping seeding.');
            return;
        }

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

        try {
            DB::table('pins')->insert($pins);
            $this->command->info('✅ Pins seeded successfully with hashed values!');
            
            // Verify the pins were inserted correctly
            $insertedCount = DB::table('pins')->where('is_active', true)->count();
            $this->command->info("📊 Total active pins: {$insertedCount}");
            
            // Test hash verification
            $testPin = DB::table('pins')->where('user_name', 'Admin User')->first();
            if ($testPin && Hash::check('391847', $testPin->pin_hash)) {
                $this->command->info('✅ Pin hash verification test passed!');
            } else {
                $this->command->error('❌ Pin hash verification test failed!');
            }
            
        } catch (\Exception $e) {
            $this->command->error('❌ Failed to seed pins: ' . $e->getMessage());
            throw $e;
        }

        if (app()->environment('production')) {
            $this->command->warn('⚠️  IMPORTANT: Change these default PINs in production!');
        }
    }
}
