<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Item;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        // Recent items (within 7 days)
        Item::create([
            'item_no' => 1,
            'category' => 'School Supplies',
            'location' => 'EFS 2nd Floor',
            'date_time' => now()->subDays(3)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(3)->format('Y-m-d H:i:s'),
            'description' => 'Blue ballpen with black cap, brand name visible',
            'is_valuable' => false,
            'status' => 'available',
            'finder_name' => 'Maria Santos',
            'finder_grade' => 'Grade 10-A',
            'finder_id' => '2024-001234',
            'officer' => 'Mrs. Laura Sabillon'
        ]);

        Item::create([
            'item_no' => 2,
            'category' => 'Gadgets / Electronics',
            'location' => 'Lobby 2 (Lost and Found Location)',
            'date_time' => now()->subDays(5)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(5)->format('Y-m-d H:i:s'),
            'description' => 'Black smartphone with cracked screen protector',
            'is_valuable' => true,
            'status' => 'available',
            'finder_name' => 'John Cruz',
            'finder_grade' => 'Grade 11-B',
            'finder_id' => '2024-005678',
            'officer' => 'Bro. Ed'
        ]);

        // Old items (past 7 days - eligible for clearing)
        Item::create([
            'item_no' => 3,
            'category' => 'Personal Belongings',
            'location' => 'DSR 1st Floor',
            'date_time' => now()->subDays(10)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(10)->format('Y-m-d H:i:s'),
            'description' => 'Red water bottle with stickers, half full',
            'is_valuable' => false,
            'status' => 'available',
            'finder_name' => 'Ana Garcia',
            'finder_grade' => 'Grade 9-C',
            'finder_id' => '2024-009876',
            'officer' => 'Bro. Ramon'
        ]);

        Item::create([
            'item_no' => 4,
            'category' => 'School Supplies',
            'location' => 'Entrance Lobby',
            'date_time' => now()->subDays(15)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(15)->format('Y-m-d H:i:s'),
            'description' => 'Green notebook with math notes inside',
            'is_valuable' => false,
            'status' => 'available',
            'finder_name' => 'Pedro Reyes',
            'finder_grade' => 'Grade 12-A',
            'finder_id' => '2024-004321',
            'officer' => 'Mrs. Laura Sabillon'
        ]);

        Item::create([
            'item_no' => 5,
            'category' => 'Clothing',
            'location' => 'EFS 3rd Floor',
            'date_time' => now()->subDays(20)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(20)->format('Y-m-d H:i:s'),
            'description' => 'White school uniform polo, size Medium',
            'is_valuable' => false,
            'status' => 'available',
            'finder_name' => 'Lisa Mendoza',
            'finder_grade' => 'Grade 8-D',
            'finder_id' => '2024-007890',
            'officer' => 'Bro. Ed'
        ]);
    }
}