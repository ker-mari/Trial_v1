<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PendingEdit;
use App\Models\Item;

class PendingEditSeeder extends Seeder
{
    public function run()
    {
        $pendingEdits = [
            [
                'created_at' => '2025-01-10',
                'category' => 'Tumbler',
                'is_valuable' => false,
                'user_name' => 'Mr. Guard 1'
            ],
            [
                'created_at' => '2025-02-10',
                'category' => 'Handkerchief',
                'is_valuable' => false,
                'user_name' => 'Ms. Guard 2'
            ],
            [
                'created_at' => '2025-03-31',
                'category' => 'Phone',
                'is_valuable' => true,
                'user_name' => 'Mr. Guard 1'
            ],
            [
                'created_at' => '2025-06-07',
                'category' => 'Wallet',
                'is_valuable' => true,
                'user_name' => 'Ms. Guard 2'
            ],
            [
                'created_at' => '2025-07-29',
                'category' => 'Mirror',
                'is_valuable' => false,
                'user_name' => 'Mr. Guard 1'
            ],
            [
                'created_at' => '2025-08-09',
                'category' => 'Pencil',
                'is_valuable' => false,
                'user_name' => 'Ms. Guard 2'
            ],
            [
                'created_at' => '2025-09-17',
                'category' => 'Ballpen',
                'is_valuable' => false,
                'user_name' => 'Mr. Guard 1'
            ],
            [
                'created_at' => '2025-10-05',
                'category' => 'Ballpen',
                'is_valuable' => false,
                'user_name' => 'Ms. Guard 2'
            ],
            [
                'created_at' => '2025-10-11',
                'category' => 'Student ID',
                'is_valuable' => true,
                'user_name' => 'Mr. Guard 1'
            ],
            [
                'created_at' => '2025-10-10',
                'category' => 'Tumbler',
                'is_valuable' => false,
                'user_name' => 'Ms. Guard 2'
            ]
        ];

        foreach ($pendingEdits as $editData) {
            // Create a dummy item first
            $item = Item::create([
                'item_no' => 'ITEM-' . time() . '-' . rand(1000, 9999),
                'category' => $editData['category'],
                'is_valuable' => $editData['is_valuable'],
                'location' => 'Campus Ground',
                'date_time' => $editData['created_at'],
                'description' => 'Found ' . $editData['category'],
                'status' => 'available'
            ]);

            // Create pending edit
            PendingEdit::create([
                'item_id' => $item->id,
                'user_name' => $editData['user_name'],
                'edit_type' => 'update',
                'original_data' => $item->toArray(),
                'new_data' => array_merge($item->toArray(), [
                    'description' => 'Updated description for ' . $editData['category']
                ]),
                'status' => 'pending',
                'created_at' => $editData['created_at'],
                'updated_at' => $editData['created_at']
            ]);
        }
    }
}