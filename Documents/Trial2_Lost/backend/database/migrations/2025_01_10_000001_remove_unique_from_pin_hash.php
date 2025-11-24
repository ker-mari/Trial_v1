<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pins', function (Blueprint $table) {
            // Remove unique constraint from pin_hash
            // Bcrypt hashes are always unique anyway due to random salts
            $table->dropUnique(['pin_hash']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pins', function (Blueprint $table) {
            // Add unique constraint back
            $table->unique('pin_hash');
        });
    }
};

