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
            'officer' => 'Mr. Eric Pader'
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

        Item::create([
            'item_no' => 3,
            'category' => 'Personal Belongings',
            'location' => 'DSR 1st Floor',
            'date_time' => now()->subDays(2)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(2)->format('Y-m-d H:i:s'),
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
            'category' => 'Clothing',
            'location' => 'EFS 3rd Floor',
            'date_time' => now()->subDays(4)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(4)->format('Y-m-d H:i:s'),
            'description' => 'White school uniform polo, size Medium',
            'is_valuable' => false,
            'status' => 'available',
            'finder_name' => 'Lisa Mendoza',
            'finder_grade' => 'Grade 8-D',
            'finder_id' => '2024-007890',
            'officer' => 'Bro. Ed'
        ]);

        Item::create([
            'item_no' => 5,
            'category' => 'Gadgets / Electronics',
            'location' => 'Library 1st Floor',
            'date_time' => now()->subDays(6)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(6)->format('Y-m-d H:i:s'),
            'description' => 'White earphones with tangled wire',
            'is_valuable' => true,
            'status' => 'available',
            'finder_name' => 'Carlos Rivera',
            'finder_grade' => 'Grade 12-C',
            'finder_id' => '2024-003456',
            'officer' => 'Mr. Eric Pader'
        ]);

        Item::create([
            'item_no' => 6,
            'category' => 'School Supplies',
            'location' => 'Canteen Area',
            'date_time' => now()->subDays(1)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(1)->format('Y-m-d H:i:s'),
            'description' => 'Scientific calculator with protective case',
            'is_valuable' => true,
            'status' => 'available',
            'finder_name' => 'Sarah Kim',
            'finder_grade' => 'Grade 11-A',
            'finder_id' => '2024-008765',
            'officer' => 'Bro. Ramon'
        ]);

        // Old items (past 7 days - eligible for clearing)
        Item::create([
            'item_no' => 7,
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
            'officer' => 'Mr. Eric Pader'
        ]);

        Item::create([
            'item_no' => 8,
            'category' => 'Personal Belongings',
            'location' => 'Gymnasium',
            'date_time' => now()->subDays(12)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(12)->format('Y-m-d H:i:s'),
            'description' => 'Black sports bag with school logo',
            'is_valuable' => false,
            'status' => 'available',
            'finder_name' => 'Miguel Torres',
            'finder_grade' => 'Grade 10-B',
            'finder_id' => '2024-006543',
            'officer' => 'Bro. Ed'
        ]);

        Item::create([
            'item_no' => 9,
            'category' => 'Gadgets / Electronics',
            'location' => 'Computer Lab',
            'date_time' => now()->subDays(18)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(18)->format('Y-m-d H:i:s'),
            'description' => 'USB flash drive 16GB, blue color',
            'is_valuable' => true,
            'status' => 'available',
            'finder_name' => 'Jenny Lopez',
            'finder_grade' => 'Grade 9-A',
            'finder_id' => '2024-002109',
            'officer' => 'Bro. Ramon'
        ]);

        Item::create([
            'item_no' => 10,
            'category' => 'Clothing',
            'location' => 'Chapel',
            'date_time' => now()->subDays(25)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(25)->format('Y-m-d H:i:s'),
            'description' => 'Navy blue sweater, size Large',
            'is_valuable' => false,
            'status' => 'available',
            'finder_name' => 'Robert Chen',
            'finder_grade' => 'Grade 8-A',
            'finder_id' => '2024-009012',
            'officer' => 'Mr. Eric Pader'
        ]);

        Item::create([
            'item_no' => 11,
            'category' => 'School Supplies',
            'location' => 'Science Lab',
            'date_time' => now()->subDays(8)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(8)->format('Y-m-d H:i:s'),
            'description' => 'Ruler set with compass and protractor',
            'is_valuable' => false,
            'status' => 'available',
            'finder_name' => 'Emma Davis',
            'finder_grade' => 'Grade 11-C',
            'finder_id' => '2024-005432',
            'officer' => 'Bro. Ed'
        ]);

        Item::create([
            'item_no' => 12,
            'category' => 'Personal Belongings',
            'location' => 'Music Room',
            'date_time' => now()->subDays(30)->format('Y-m-d H:i:s'),
            'date_handed_over' => now()->subDays(30)->format('Y-m-d H:i:s'),
            'description' => 'Black eyeglasses with thin frame',
            'is_valuable' => true,
            'status' => 'available',
            'finder_name' => 'Alex Johnson',
            'finder_grade' => 'Grade 12-B',
            'finder_id' => '2024-007654',
            'officer' => 'Bro. Ramon'
        ]);
    }
}