<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('code', 1);
            $table->string('item_name');
            $table->string('owner')->nullable();
            $table->string('status');
            $table->string('officer');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('history');
    }
};