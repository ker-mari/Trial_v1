<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rejection_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->foreignId('pending_edit_id')->nullable()->constrained('pending_edits')->onDelete('set null');
            $table->text('rejection_reason');
            $table->string('rejected_by');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rejection_comments');
    }
};

