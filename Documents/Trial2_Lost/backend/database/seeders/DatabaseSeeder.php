<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pin;
use App\Models\Item;
use App\Models\History;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create PINs
        Pin::create([
            'pin_hash' => Hash::make('847293'),
            'user_name' => 'Bro. Ed',
            'is_admin' => false,
            'is_active' => true,
        ]);

        Pin::create([
            'pin_hash' => Hash::make('562018'),
            'user_name' => 'Bro. Ramon',
            'is_admin' => false,
            'is_active' => true,
        ]);

        Pin::create([
            'pin_hash' => Hash::make('391847'),
            'user_name' => 'Mrs. Laura Sabillion',
            'is_admin' => true,
            'is_active' => true,
        ]);

        // Create sample items
        Item::create([
            'item_no' => '001',
            'category' => 'Electronics',
            'description' => 'Black iPhone with cracked screen',
            'location' => 'Library',
            'date_time' => now()->subDays(5),
            'is_valuable' => true,
            'status' => 'available',
        ]);

        Item::create([
            'item_no' => '002',
            'category' => 'Accessories',
            'description' => 'Blue water bottle with stickers',
            'location' => 'Cafeteria',
            'date_time' => now()->subDays(3),
            'is_valuable' => false,
            'status' => 'available',
        ]);

        Item::create([
            'item_no' => '003',
            'category' => 'Documents',
            'description' => 'Student ID card',
            'location' => 'Parking Lot',
            'date_time' => now()->subDays(1),
            'is_valuable' => true,
            'status' => 'available',
        ]);

        // Items to be cleared (older than 30 days)
        $oldItem1 = Item::create([
            'item_no' => '004',
            'category' => 'Clothing',
            'description' => 'Red jacket',
            'location' => 'Gymnasium',
            'date_time' => now()->subDays(35),
            'is_valuable' => false,
            'status' => 'available',
        ]);

        $oldItem2 = Item::create([
            'item_no' => '005',
            'category' => 'Books',
            'description' => 'Mathematics textbook',
            'location' => 'Classroom 101',
            'date_time' => now()->subDays(40),
            'is_valuable' => true,
            'status' => 'available',
        ]);

        // Claimed item for history
        $claimedItem = Item::create([
            'item_no' => '006',
            'category' => 'Electronics',
            'description' => 'Wireless earbuds',
            'location' => 'Student Center',
            'date_time' => now()->subDays(10),
            'is_valuable' => true,
            'status' => 'claimed',
            'claimer_name' => 'Alice Johnson',
            'claimer_id' => 'STU123',
            'claimer_grade' => 'Psychology',
            'claim_date' => now()->subDays(2),
        ]);

        // Create history records
        History::create([
            'date' => now()->subDays(2)->toDateString(),
            'code' => 'V',
            'item_name' => 'Wireless earbuds',
            'owner' => 'Alice Johnson',
            'status' => 'Claimed',
            'officer' => 'Test Guard',
        ]);

        History::create([
            'date' => now()->subDays(5)->toDateString(),
            'code' => 'V',
            'item_name' => 'Black iPhone with cracked screen',
            'owner' => null,
            'status' => 'Handed Over',
            'officer' => 'Test Guard',
        ]);

        History::create([
            'date' => now()->subDays(3)->toDateString(),
            'code' => 'L',
            'item_name' => 'Blue water bottle with stickers',
            'owner' => null,
            'status' => 'Handed Over',
            'officer' => 'Test Admin',
        ]);
    }
}