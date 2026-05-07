<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OperationalHour;
use App\Models\BlockedDate;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    // ─── GET: Ambil semua data jadwal ─────────────────────────────
    public function index()
    {
        $DAY_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

        $hours = OperationalHour::all()
            ->sortBy(fn($h) => array_search($h->day, $DAY_ORDER))
            ->values()
            ->map(fn($h) => [
                'id'        => $h->id,
                'day'       => $h->day,
                'start'     => substr($h->start_time, 0, 5), // HH:MM
                'end'       => substr($h->end_time, 0, 5),
                'duration'  => $h->duration,
                'active'    => $h->is_active,
            ]);

        $blocked = BlockedDate::orderBy('date')->get()->map(fn($b) => [
            'id'        => $b->id,
            'date'      => $b->date,
            'desc'      => $b->description,
            'timeRange' => ($b->start_time && $b->end_time)
                            ? substr($b->start_time, 0, 5) . ' - ' . substr($b->end_time, 0, 5)
                            : 'Full Day',
            'startTime' => $b->start_time ? substr($b->start_time, 0, 5) : '',
            'endTime'   => $b->end_time   ? substr($b->end_time, 0, 5)   : '',
        ]);

        return response()->json([
            'hours'   => $hours,
            'blocked' => $blocked,
        ]);
    }

    // ─── POST: Simpan jam operasional (batch upsert) ───────────────
    public function updateHours(Request $request)
    {
        $request->validate([
            'hours'             => 'required|array',
            'hours.*.day'       => 'required|string',
            'hours.*.start'     => 'required|string',
            'hours.*.end'       => 'required|string',
            'hours.*.duration'  => 'required|integer|in:30,45,60,90',
            'hours.*.active'    => 'required|boolean',
        ]);

        foreach ($request->hours as $item) {
            OperationalHour::updateOrCreate(
                ['day' => $item['day']],
                [
                    'start_time' => $item['start'] . ':00',
                    'end_time'   => $item['end'] . ':00',
                    'duration'   => $item['duration'],
                    'is_active'  => $item['active'],
                ]
            );
        }

        return response()->json(['message' => 'Jadwal berhasil disimpan.']);
    }

    // ─── POST: Tambah blokir tanggal ──────────────────────────────
    public function storeBlocked(Request $request)
    {
        $request->validate([
            'date'       => 'required|date',
            'desc'       => 'nullable|string|max:255',
            'start_time' => 'nullable|string',
            'end_time'   => 'nullable|string',
        ]);

        $b = BlockedDate::create([
            'date'        => $request->date,
            'description' => $request->desc,
            'start_time'  => $request->start_time ?: null,
            'end_time'    => $request->end_time   ?: null,
        ]);

        return response()->json([
            'id'        => $b->id,
            'date'      => $b->date,
            'desc'      => $b->description,
            'timeRange' => ($b->start_time && $b->end_time)
                            ? substr($b->start_time, 0, 5) . ' - ' . substr($b->end_time, 0, 5)
                            : 'Full Day',
            'startTime' => $b->start_time ? substr($b->start_time, 0, 5) : '',
            'endTime'   => $b->end_time   ? substr($b->end_time, 0, 5)   : '',
        ], 201);
    }

    // ─── DELETE: Hapus blokir tanggal ─────────────────────────────
    public function destroyBlocked(BlockedDate $blockedDate)
    {
        $blockedDate->delete();
        return response()->json(['message' => 'Blokir tanggal berhasil dihapus.']);
    }
}
