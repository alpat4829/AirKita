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
        Schema::create('pesanan', function (Blueprint $table) {
            $table->id('ID_Pesanan'); // PK Sesuai ERD
            $table->unsignedBigInteger('ID_Pelanggan');
            $table->unsignedBigInteger('ID_Produk');
            $table->dateTime('Tanggal_Pesan');
            $table->string('Status_Pesanan'); // Contoh: Dikirim, Selesai
            $table->integer('Harga');
            $table->string('Metode_Pembayaran')->nullable(); // Digital atau Manual [cite: 19]
            $table->string('Status_Pembayaran')->default('Pending');
            $table->dateTime('Tanggal_Pembayaran')->nullable();
            $table->string('snap_token')->nullable(); // Untuk Midtrans

            $table->foreign('ID_Pelanggan')->references('ID_Pelanggan')->on('pelanggan');
            $table->foreign('ID_Produk')->references('ID_Produk')->on('produk');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanans');
    }
};
