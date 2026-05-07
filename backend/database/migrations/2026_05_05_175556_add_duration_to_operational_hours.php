<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('operational_hours', function (Blueprint $table) {
            $table->integer('duration')->default(45)->after('end_time'); // in minutes
        });
    }

    public function down(): void
    {
        Schema::table('operational_hours', function (Blueprint $table) {
            $table->dropColumn('duration');
        });
    }
};
