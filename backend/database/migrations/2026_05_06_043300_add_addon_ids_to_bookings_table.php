<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // JSON snapshot addon yang dipilih saat booking
            // Contoh: [{"id":1,"name":"Cetak foto tambahan","price":50000}]
            $table->json('addon_ids')->nullable()->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('addon_ids');
        });
    }
};
