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
            $table->foreignUuid('scanned_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('scanned_at')->useCurrent();
            $table->boolean('is_valid')->default(false);
            $table->timestamp('expired_at')->nullable();
            $table->timestamps(); // optional, recommended
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
