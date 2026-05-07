<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->timestamps();
        });

        // Seed nilai default
        $defaults = [
            'studio_name'     => 'StudioBook Jakarta',
            'studio_desc'     => 'Studio foto profesional dengan konsep minimalis modern.',
            'contact_phone'   => '+62 812-3456-7890',
            'contact_email'   => 'hello@studiobook.com',
            'contact_address' => 'Jl. Senopati No. 42, Jakarta Selatan',
            'contact_ig'      => '@studiobook.jkt',
            'payment_bank'    => 'BCA',
            'payment_number'  => '1234567890',
            'payment_name'    => 'PT Studio Foto Jaya',
        ];

        foreach ($defaults as $key => $value) {
            \DB::table('settings')->insert([
                'key'        => $key,
                'value'      => $value,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
