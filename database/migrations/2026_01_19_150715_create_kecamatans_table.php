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
        Schema::create('kecamatan', function (Blueprint $table) {
            $table->id('ID_Kecamatan'); // PK Sesuai ERD
            $table->unsignedBigInteger('ID_Kabupaten'); // FK ke Kabupaten
            $table->string('Kode_Kecamatan')->unique();
            $table->string('Nama_Kec'); // Contoh: Koto Tangah, Pauh [cite: 15]
            $table->foreign('ID_Kabupaten')->references('ID_Kabupaten')->on('kabupaten')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kecamatans');
    }
};
