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
            $table->string('claimer_name')->nullable()->after('finder_id');
            $table->string('claimer_grade')->nullable()->after('claimer_name');
            $table->string('claimer_id')->nullable()->after('claimer_grade');
            $table->dateTime('claim_date')->nullable()->after('claimer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn(['claimer_name', 'claimer_grade', 'claimer_id', 'claim_date']);
        });
    }
};