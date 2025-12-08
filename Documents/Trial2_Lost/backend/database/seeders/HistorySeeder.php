<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\History;

class HistorySeeder extends Seeder
{
    public function run(): void
    {
        History::create([
            'item_id' => 1,
            'date' => now()->subDays(3)->toDateString(),
            'code' => 'V',
            'item_name' => 'Smartphone',
            'owner' => 'John Doe',
            'status' => 'Claimed',
            'officer' => 'Mr. Guard 1',
            'created_at' => now()->subDays(3)
        ]);

        History::create([
            'item_id' => 2,
            'date' => now()->subDays(5)->toDateString(),
            'code' => 'L',
            'item_name' => 'Hair Clip',
            'owner' => 'Jane Smith',
            'status' => 'Claimed',
            'officer' => 'Ms. Guard 2',
            'created_at' => now()->subDays(5)
        ]);

        History::create([
            'item_id' => 3,
            'date' => now()->subDays(10)->toDateString(),
            'code' => 'L',
            'item_name' => 'Notebook',
            'owner' => null,
            'status' => 'Cleared',
            'officer' => 'Mr. Guard 1',
            'created_at' => now()->subDays(10)
        ]);

        History::create([
            'item_id' => 4,
            'date' => now()->subDays(7)->toDateString(),
            'code' => 'V',
            'item_name' => 'Watch',
            'owner' => 'Mike Johnson',
            'status' => 'Claimed',
            'officer' => 'Ms. Guard 2',
            'created_at' => now()->subDays(7)
        ]);
    }
}