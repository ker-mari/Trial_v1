<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Skip if using SQLite (common in deployment environments)
        if (config('database.default') === 'sqlite') {
            return;
        }
        
        Schema::table('items', function (Blueprint $table) {
            $table->longText('image')->nullable()->change();
        });
    }

    public function down(): void
    {
        // Skip if using SQLite
        if (config('database.default') === 'sqlite') {
            return;
        }
        
        Schema::table('items', function (Blueprint $table) {
            $table->string('image')->nullable()->change();
        });
    }
};