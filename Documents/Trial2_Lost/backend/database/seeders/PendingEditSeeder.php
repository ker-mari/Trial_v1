<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PendingEdit;
use App\Models\Item;

class PendingEditSeeder extends Seeder
{
    public function run()
    {
        // Get existing items to create edits for
        $items = Item::where('status', 'available')->take(2)->get();
        
        if ($items->count() > 0) {
            $item1 = $items->first();
            $originalData = $item1->toArray();
            $newData = $originalData;
            $newData['description'] = 'Updated: ' . $originalData['description'];
            
            PendingEdit::create([
                'item_id' => $item1->id,
                'user_name' => 'Mr. Guard 1',
                'edit_type' => 'update',
                'original_data' => $originalData,
                'new_data' => $newData,
                'status' => 'pending',
                'created_at' => now()->subHours(2)
            ]);
        }
        
        if ($items->count() > 1) {
            $item2 = $items->get(1);
            $originalData = $item2->toArray();
            $newData = $originalData;
            $newData['location'] = 'Updated Location';
            
            PendingEdit::create([
                'item_id' => $item2->id,
                'user_name' => 'Ms. Guard 2',
                'edit_type' => 'update',
                'original_data' => $originalData,
                'new_data' => $newData,
                'status' => 'pending',
                'created_at' => now()->subHours(1)
            ]);
        }
    }
}