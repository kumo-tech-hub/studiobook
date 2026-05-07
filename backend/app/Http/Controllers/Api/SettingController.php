<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    private array $KEYS = [
        'studio_name', 'studio_desc',
        'contact_phone', 'contact_email', 'contact_address', 'contact_ig',
        'payment_bank', 'payment_number', 'payment_name',
    ];

    // GET /admin/settings → semua settings sebagai key-value object
    public function index()
    {
        $rows = Setting::whereIn('key', $this->KEYS)->pluck('value', 'key');

        // Pastikan semua key ada (walau nilai null)
        $data = [];
        foreach ($this->KEYS as $k) {
            $data[$k] = $rows[$k] ?? '';
        }

        return response()->json($data);
    }

    // PUT /admin/settings → update banyak key sekaligus
    public function update(Request $request)
    {
        $allowed = array_intersect_key($request->all(), array_flip($this->KEYS));

        foreach ($allowed as $key => $value) {
            Setting::set($key, $value);
        }

        return response()->json(['message' => 'Pengaturan berhasil disimpan.']);
    }

    // GET /settings/public → endpoint publik (tidak perlu auth) untuk payment info
    public function public()
    {
        return response()->json([
            'studio_name'    => Setting::get('studio_name'),
            'payment_bank'   => Setting::get('payment_bank'),
            'payment_number' => Setting::get('payment_number'),
            'payment_name'   => Setting::get('payment_name'),
            'contact_phone'  => Setting::get('contact_phone'),
        ]);
    }
}
