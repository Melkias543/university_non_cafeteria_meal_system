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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary(); // consistent with UUID usage
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('order_id')->nullable()->constrained('orders')->onDelete('set null');
            $table->enum('type', ['deposit', 'deduction', 'refund']);
            $table->decimal('amount', 10, 2);
            $table->decimal('balance_after', 10, 2);
            $table->timestamps();

            // Indexes for faster queries
            $table->index('user_id');
            $table->index('order_id');
            $table->index('type');
        


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
