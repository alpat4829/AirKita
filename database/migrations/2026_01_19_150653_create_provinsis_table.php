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
        Schema::create('provinsi', function (Blueprint $table) {
            $table->id('ID_Provinsi'); // PK Sesuai ERD
            $table->string('Kode_Provinsi')->unique(); // Atribut Kode tambahan
            $table->string('Nama_Provinsi'); // Nama_Provinsi [cite: 13]
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provinsis');
    }
};
