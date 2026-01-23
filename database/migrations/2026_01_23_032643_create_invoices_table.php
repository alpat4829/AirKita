<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->unsignedBigInteger('id_pesanan');
            $table->unsignedBigInteger('id_pelanggan');
            $table->unsignedBigInteger('id_mitra');
            $table->enum('invoice_type', ['user', 'mitra']);
            $table->integer('total_amount');
            $table->integer('tax_amount')->default(0);
            $table->integer('subtotal');
            $table->string('payment_method');
            $table->dateTime('payment_date');
            $table->enum('status', ['paid', 'cancelled'])->default('paid');
            $table->text('notes')->nullable();

            $table->foreign('id_pesanan')->references('ID_Pesanan')->on('pesanan')->onDelete('cascade');
            $table->foreign('id_pelanggan')->references('ID_Pelanggan')->on('pelanggan')->onDelete('cascade');
            $table->foreign('id_mitra')->references('ID_Mitra')->on('mitra')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
