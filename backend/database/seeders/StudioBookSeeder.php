<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\Addon;
use App\Models\Booking;
use App\Models\OperationalHour;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudioBookSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Booking::truncate();
        Package::truncate();
        Addon::truncate();
        OperationalHour::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // ─── 1. PACKAGES ──────────────────────────────────────────
        $packages = [
            [
                'title'       => 'Solo Session',
                'meta'        => '1 orang · 30 min · 60+ foto',
                'description' => json_encode([
                    ['text' => 'Sesi 30 menit penuh di dalam studio'],
                    ['text' => 'Semua hasil foto dikirim dalam format digital'],
                    ['text' => 'Background pilihan tersedia'],
                ]),
                'price'       => 125000,
                'image_path'  => null,
                'is_active'   => true,
                'is_special'  => false,
            ],
            [
                'title'       => 'Duo Frame',
                'meta'        => '2 orang · 45 min · 100+ foto',
                'description' => json_encode([
                    ['text' => 'Paling populer untuk couple & best friend'],
                    ['text' => '45 menit sesi studio eksklusif'],
                    ['text' => 'Semua hasil foto + 1 background ekstra gratis'],
                ]),
                'price'       => 185000,
                'image_path'  => null,
                'is_active'   => true,
                'is_special'  => true,
            ],
            [
                'title'       => 'Squad Session',
                'meta'        => '3-4 orang · 60 min · 150+ foto',
                'description' => json_encode([
                    ['text' => 'Cocok untuk grup hingga 4 orang'],
                    ['text' => '60 menit penuh tanpa tambahan biaya'],
                    ['text' => 'Semua hasil foto dikirim dalam format digital'],
                ]),
                'price'       => 265000,
                'image_path'  => null,
                'is_active'   => true,
                'is_special'  => false,
            ],
            [
                'title'       => 'Family Edition',
                'meta'        => '5-8 orang · 90 min · 200+ foto + cetak',
                'description' => json_encode([
                    ['text' => 'Hingga 8 anggota keluarga dalam satu sesi'],
                    ['text' => '90 menit sesi studio + konsultasi pose gratis'],
                    ['text' => 'Termasuk cetak foto 5R 1 lembar'],
                ]),
                'price'       => 425000,
                'image_path'  => null,
                'is_active'   => true,
                'is_special'  => false,
            ],
        ];

        foreach ($packages as $pkg) {
            Package::create($pkg);
        }

        // ─── 2. ADD-ONS ───────────────────────────────────────────
        $addons = [
            ['name' => 'Cetak foto tambahan', 'description' => '4 lembar ukuran 4R', 'price' => 50000, 'icon_name' => 'print', 'is_active' => true],
            ['name' => 'Background extra',     'description' => '1 background tambahan pilihan', 'price' => 75000, 'icon_name' => 'bg',    'is_active' => true],
            ['name' => 'Extra waktu',          'description' => 'Tambah 30 menit sesi',    'price' => 100000, 'icon_name' => 'time',   'is_active' => true],
            ['name' => 'Makeup artist',        'description' => 'Touch up profesional',    'price' => 150000, 'icon_name' => 'makeup', 'is_active' => true],
        ];

        foreach ($addons as $addon) {
            Addon::create($addon);
        }

        // ─── 3. OPERATIONAL HOURS ─────────────────────────────────
        $hours = [
            ['day' => 'Senin',  'start_time' => '10:00:00', 'end_time' => '22:00:00', 'duration' => 45, 'is_active' => true],
            ['day' => 'Selasa', 'start_time' => '10:00:00', 'end_time' => '22:00:00', 'duration' => 45, 'is_active' => true],
            ['day' => 'Rabu',   'start_time' => '10:00:00', 'end_time' => '22:00:00', 'duration' => 45, 'is_active' => true],
            ['day' => 'Kamis',  'start_time' => '10:00:00', 'end_time' => '22:00:00', 'duration' => 45, 'is_active' => true],
            ['day' => 'Jumat',  'start_time' => '10:00:00', 'end_time' => '23:00:00', 'duration' => 45, 'is_active' => true],
            ['day' => 'Sabtu',  'start_time' => '09:00:00', 'end_time' => '23:00:00', 'duration' => 30, 'is_active' => true],
            ['day' => 'Minggu', 'start_time' => '09:00:00', 'end_time' => '22:00:00', 'duration' => 30, 'is_active' => true],
        ];

        foreach ($hours as $h) {
            OperationalHour::create($h);
        }

        // ─── 4. BOOKINGS ──────────────────────────────────────────
        $allPackages = Package::all();
        $customers = [
            ['Anindya Paramita', '+62 812-3344-1290', 'anindya@email.com'],
            ['Reza Darmawan',    '+62 813-9900-4422', 'reza@email.com'],
            ['Maria & Kevin',    '+62 877-1122-3344', 'maria@email.com'],
            ['Dimas Prasetyo',   '+62 811-5566-7788', 'dimas@email.com'],
            ['Gisel Natasha',    '+62 878-3344-1100', 'gisel@email.com'],
            ['Family Santoso',   '+62 812-7788-2211', 'santoso@email.com'],
            ['Putri Handayani',  '+62 821-9988-7766', 'putri@email.com'],
            ['Bagas & Team',     '+62 819-2233-4455', 'bagas@email.com'],
            ['Dian Amelia',      '+62 811-2233-4455', 'dian@email.com'],
            ['Hendra Setiawan',  '+62 821-1122-3344', 'hendra@email.com'],
            ['Rini Yulianti',    '+62 877-6655-4433', 'rini@email.com'],
            ['Lukman Hakim',     '+62 813-5566-7788', 'lukman@email.com'],
            ['Sari Anggita',     '+62 812-9988-7766', 'sari@email.com'],
            ['Adit & Friends',   '+62 819-1122-3344', 'adit@email.com'],
        ];

        $allAddons = Addon::all();
        $slots   = ['10:00 - 10:45', '11:00 - 11:45', '13:00 - 13:45', '14:00 - 14:45', '15:00 - 15:45', '16:00 - 16:45', '18:00 - 18:45', '19:00 - 19:45'];
        $dates   = ['2026-04-24', '2026-04-25', '2026-04-26', '2026-04-27', '2026-04-28', '2026-05-01', '2026-05-02', '2026-05-03'];
        $statuses = ['Lunas', 'Lunas', 'Pending', 'Lunas', 'Pending', 'Batal'];

        foreach ($customers as $idx => $c) {
            $pkg = $allPackages->random();

            // Beberapa booking punya addon, beberapa tidak
            $addonIds = [];
            if ($idx % 3 === 0 && $allAddons->isNotEmpty()) {
                // 1 addon
                $picked = $allAddons->random();
                $addonIds = [['id' => $picked->id, 'name' => $picked->name, 'price' => $picked->price]];
            } elseif ($idx % 3 === 1 && $allAddons->count() >= 2) {
                // 2 addon
                $picked = $allAddons->random(2);
                $addonIds = $picked->map(fn($a) => ['id' => $a->id, 'name' => $a->name, 'price' => $a->price])->values()->toArray();
            }

            $addonTotal = collect($addonIds)->sum('price');

            Booking::create([
                'booking_code'  => 'BK-' . str_pad(2041 - $idx, 4, '0', STR_PAD_LEFT),
                'customer_name' => $c[0],
                'customer_phone'=> $c[1],
                'customer_email'=> $c[2],
                'package_id'    => $pkg->id,
                'package_name'  => $pkg->title,
                'booking_date'  => $dates[$idx % count($dates)],
                'slot_time'     => $slots[$idx % count($slots)],
                'total_price'   => $pkg->price + $addonTotal,
                'status'        => $statuses[$idx % count($statuses)],
                'addon_ids'     => $addonIds ?: null,
            ]);
        }

        $this->command->info('✅ StudioBook seeder selesai: Packages, Add-ons, Jam Operasional, dan Bookings berhasil ditambahkan.');
    }
}
