<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mitra', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('Nama_Mitra');
        });

        // Generate slugs for existing records
        $mitras = DB::table('mitra')->get();
        foreach ($mitras as $mitra) {
            $slug = Str::slug($mitra->Nama_Mitra);

            // Ensure uniqueness by appending ID if slug already exists
            $originalSlug = $slug;
            $counter = 1;
            while (DB::table('mitra')->where('slug', $slug)->where('ID_Mitra', '!=', $mitra->ID_Mitra)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            DB::table('mitra')->where('ID_Mitra', $mitra->ID_Mitra)->update(['slug' => $slug]);
        }

        // Make slug non-nullable after populating
        Schema::table('mitra', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mitra', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
