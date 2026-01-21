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
        Schema::create('kelurahan', function (Blueprint $table) {
            $table->id('ID_KELURAHAN'); // PK Sesuai ERD
            $table->unsignedBigInteger('ID_Kecamatan'); // FK ke Kecamatan
            $table->string('Kode_Kelurahan')->unique();
            $table->string('Nama_Kel'); // Contoh: Air Tawar Barat, Cupak Tangah [cite: 16]
            $table->foreign('ID_Kecamatan')->references('ID_Kecamatan')->on('kecamatan')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelurahans');
    }
};
