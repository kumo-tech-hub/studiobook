<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blocked_dates', function (Blueprint $table) {
            $table->time('start_time')->nullable()->after('date'); // null = full day
            $table->time('end_time')->nullable()->after('start_time');
        });
    }

    public function down(): void
    {
        Schema::table('blocked_dates', function (Blueprint $table) {
            $table->dropColumn(['start_time', 'end_time']);
        });
    }
};
