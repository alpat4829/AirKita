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
        Schema::create('produk', function (Blueprint $table) {
            $table->id('ID_Produk'); // PK Sesuai ERD
            $table->unsignedBigInteger('ID_Mitra'); // FK ke Mitra
            $table->string('Nama_Produk');
            $table->integer('Harga');
            $table->text('Deskripsi');
            $table->foreign('ID_Mitra')->references('ID_Mitra')->on('mitra')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produks');
    }
};
