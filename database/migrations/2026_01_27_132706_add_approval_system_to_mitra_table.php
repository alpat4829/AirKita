<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mitra', function (Blueprint $table) {
            // Add approval status column
            $table->string('approval_status', 20)
                ->default('pending');

            // Add verification timestamp
            $table->timestamp('verified_at')->nullable();

            // Add verifier (admin who approved/rejected)
            $table->unsignedBigInteger('verified_by')->nullable();
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');

            // Add rejection reason
            $table->text('rejection_reason')->nullable();
        });

        // Set all existing depots to 'approved' status
        DB::table('mitra')->update([
            'approval_status' => 'approved',
            'verified_at' => now()
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mitra', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['verified_by']);

            // Drop columns
            $table->dropColumn([
                'approval_status',
                'verified_at',
                'verified_by',
                'rejection_reason'
            ]);
        });
    }
};
