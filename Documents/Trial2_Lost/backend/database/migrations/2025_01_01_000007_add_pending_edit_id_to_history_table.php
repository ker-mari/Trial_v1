<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('history', function (Blueprint $table) {
            $table->unsignedBigInteger('pending_edit_id')->nullable()->after('item_id');
            $table->foreign('pending_edit_id')->references('id')->on('pending_edits')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('history', function (Blueprint $table) {
            $table->dropForeign(['pending_edit_id']);
            $table->dropColumn('pending_edit_id');
        });
    }
};