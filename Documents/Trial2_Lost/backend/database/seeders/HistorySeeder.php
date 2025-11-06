<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\History;

class HistorySeeder extends Seeder
{
    public function run(): void
    {
        History::create([
            'date' => '2025-10-15',
            'code' => 'L',
            'item_name' => 'Tumbler',
            'owner' => 'Ruby Chan',
            'status' => 'Claimed',
            'officer' => 'Bro. Ed'
        ]);

        History::create([
            'date' => '2025-10-11',
            'code' => 'L',
            'item_name' => 'Handkerchief',
            'owner' => '',
            'status' => 'Cleared',
            'officer' => 'Bro. Ed'
        ]);

        History::create([
            'date' => '2025-10-05',
            'code' => 'V',
            'item_name' => 'Phone',
            'owner' => 'Laine Vern',
            'status' => 'Claimed',
            'officer' => 'Bro.'
        ]);
    }
}