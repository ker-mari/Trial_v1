<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('item_no')->unique();
            $table->string('category', 255);
            $table->boolean('is_valuable')->default(false);
            $table->longText('image')->nullable();
            $table->string('location', 200);
            $table->datetime('date_time');
            $table->text('description');
            $table->enum('status', ['available', 'claimed'])->default('available');
            $table->string('finder_name', 255)->nullable();
            $table->string('finder_grade', 255)->nullable();
            $table->string('finder_id', 50)->nullable();
            $table->string('claimer_name', 100)->nullable();
            $table->string('claimer_grade', 100)->nullable();
            $table->string('claimer_id', 50)->nullable();
            $table->datetime('claim_date')->nullable();
            $table->string('officer', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};