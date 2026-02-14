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
        Schema::create('qr_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignUuid('scanned_by')->nullable()->constrained('users')->onDelete('cascade'); // nullable
            $table->timestamp('scanned_at')->nullable(); // only when scanned
            $table->boolean('is_valid')->default(true);  // valid by default
            $table->timestamp('expired_at')->nullable(); // will be set in model
            $table->timestamps();// qroptional, recommended
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qr_logs');
    }
};
