<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Item;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        // Available items
        Item::create([
            'item_no' => '001',
            'category' => 'Electronics',
            'is_valuable' => true,
            'image' => '📱',
            'location' => 'Library',
            'date_time' => now()->subDays(2),
            'description' => 'Black smartphone with cracked screen',
            'finder_name' => 'Juan Dela Cruz',
            'finder_grade' => 'Grade 11',
            'finder_id' => '2023-001',
            'officer' => 'Mr. Guard 1',
            'status' => 'available'
        ]);

        Item::create([
            'item_no' => '002',
            'category' => 'Accessories',
            'is_valuable' => false,
            'image' => '🌸',
            'location' => 'Room 205',
            'date_time' => now()->subDays(1),
            'description' => 'Pink hair clip with flower design',
            'finder_name' => 'Maria Santos',
            'finder_grade' => 'Grade 10',
            'finder_id' => '2023-002',
            'officer' => 'Ms. Guard 2',
            'status' => 'available'
        ]);

        // Items to be cleared (older than 7 days)
        Item::create([
            'item_no' => '003',
            'category' => 'Personal Belongings',
            'is_valuable' => false,
            'image' => '🧴',
            'location' => 'EFS 2nd Floor',
            'date_time' => now()->subDays(10),
            'description' => 'White tumbler with stickers',
            'finder_name' => 'Pedro Garcia',
            'finder_grade' => 'Grade 12',
            'finder_id' => '2023-003',
            'officer' => 'Mr. Guard 1',
            'status' => 'available',
            'created_at' => now()->subDays(10)
        ]);

        // Claimed items
        Item::create([
            'item_no' => '004',
            'category' => 'Electronics',
            'is_valuable' => true,
            'image' => '🎧',
            'location' => 'Library',
            'date_time' => now()->subDays(5),
            'description' => 'Wireless headphones with case',
            'finder_name' => 'Ana Lopez',
            'finder_grade' => 'Grade 11',
            'finder_id' => '2023-004',
            'claimer_name' => 'Jose Rizal',
            'claimer_grade' => 'Grade 11',
            'claimer_id' => '2023-100',
            'claim_date' => now()->subDays(2),
            'officer' => 'Ms. Guard 2',
            'status' => 'claimed'
        ]);
    }
}
