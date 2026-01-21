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
        Schema::create('kabupaten', function (Blueprint $table) {
            $table->id('ID_Kabupaten'); // PK Sesuai ERD
            $table->unsignedBigInteger('ID_Provinsi'); // FK ke Provinsi
            $table->string('Kode_Kabupaten')->unique();
            $table->string('Nama_Kab'); // Nama_Kab dari ERD
            $table->foreign('ID_Provinsi')->references('ID_Provinsi')->on('provinsi')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kabupatens');
    }
};
