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
        Schema::table('items', function (Blueprint $table) {
            // Add finder information fields
            $table->string('finder_name', 100)->nullable()->after('description');
            $table->string('finder_grade', 100)->nullable()->after('finder_name');
            $table->string('finder_id', 50)->nullable()->after('finder_grade');
            
            // Add officer field (if not already exists from previous migration)
            if (!Schema::hasColumn('items', 'officer')) {
                $table->string('officer', 100)->nullable()->after('finder_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn(['finder_name', 'finder_grade', 'finder_id']);
            // Don't drop officer as it might be from another migration
        });
    }
};

