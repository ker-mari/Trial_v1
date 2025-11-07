<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create or update a default test user
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
            ]
        );

        // Call individual seeders
        $this->call([
            UserSeeder::class,
            ItemSeeder::class,
            PendingEditSeeder::class,
            PinSeeder::class,  // PinSeeder handles pins seeding
        ]);
    }
}
