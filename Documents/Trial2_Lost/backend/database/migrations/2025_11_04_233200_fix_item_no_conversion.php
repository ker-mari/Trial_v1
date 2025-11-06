<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get all existing items and reassign sequential item_no values
        $items = DB::table('items')->orderBy('id')->get();
        
        $counter = 1;
        foreach ($items as $item) {
            DB::table('items')
                ->where('id', $item->id)
                ->update(['item_no' => $counter]);
            $counter++;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Cannot reverse this migration
    }
};

