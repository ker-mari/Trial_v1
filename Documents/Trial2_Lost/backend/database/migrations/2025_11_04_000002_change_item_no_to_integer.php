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
        Schema::table('items', function (Blueprint $table) {
            // Drop the unique constraint first
            $table->dropUnique(['item_no']);
        });

        // For SQLite, we need to recreate the table to change column type
        // First, get the max ID to set the starting point for item_no
        $maxId = DB::table('items')->max('id') ?? 0;
        
        // Update existing records to use their ID as item_no
        DB::table('items')->orderBy('id')->get()->each(function ($item) {
            DB::table('items')
                ->where('id', $item->id)
                ->update(['item_no' => (string)$item->id]);
        });

        Schema::table('items', function (Blueprint $table) {
            // Change item_no to integer
            $table->integer('item_no')->unsigned()->change();
            // Add unique constraint back
            $table->unique('item_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropUnique(['item_no']);
            $table->string('item_no')->change();
            $table->unique('item_no');
        });
    }
};

