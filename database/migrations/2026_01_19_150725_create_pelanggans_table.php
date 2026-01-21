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
        Schema::create('pelanggan', function (Blueprint $table) {
            $table->id('ID_Pelanggan'); // PK Sesuai ERD
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Link ke Login
            $table->unsignedBigInteger('ID_KELURAHAN'); // FK Wilayah 
            $table->string('Nama');
            $table->string('No_HP');
            $table->string('Alamat');
            $table->string('Email')->unique();
            $table->timestamp('Tanggal_Daftar')->useCurrent();
            $table->foreign('ID_KELURAHAN')->references('ID_KELURAHAN')->on('kelurahan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelanggans');
    }
};
