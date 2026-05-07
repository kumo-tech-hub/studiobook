<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with('package')->latest();

        // Filter status
        if ($request->status && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        // Filter tanggal range
        if ($request->start_date) {
            $query->whereDate('booking_date', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->whereDate('booking_date', '<=', $request->end_date);
        }

        // Pagination: 12 per halaman
        $perPage = $request->per_page ?? 12;
        $bookings = $query->paginate($perPage);

        return response()->json([
            'data'         => $bookings->items(),
            'current_page' => $bookings->currentPage(),
            'last_page'    => $bookings->lastPage(),
            'total'        => $bookings->total(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name'  => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'package_id'     => 'required|exists:packages,id',
            'booking_date'   => 'required|date',
            'slot_time'      => 'required|string',
            'addon_ids'      => 'nullable|array',
            'addon_ids.*.id'    => 'integer',
            'addon_ids.*.name'  => 'string',
            'addon_ids.*.price' => 'integer',
        ]);

        $package = \App\Models\Package::findOrFail($request->package_id);

        $lastCode = Booking::orderBy('id', 'desc')->first()?->booking_code ?? 'BK-0000';
        $nextNum = (int) substr($lastCode, 3) + 1;
        $code = 'BK-' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);

        // Hitung total: harga paket + jumlah semua addon
        $addonTotal = collect($request->addon_ids ?? [])->sum('price');
        $totalPrice = $package->price + $addonTotal;

        $booking = Booking::create([
            'booking_code'   => $code,
            'customer_name'  => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_email' => $request->customer_email,
            'package_id'     => $package->id,
            'package_name'   => $package->title,
            'booking_date'   => $request->booking_date,
            'slot_time'      => $request->slot_time,
            'total_price'    => $totalPrice,
            'status'         => 'Pending',
            'notes'          => $request->notes,
            'addon_ids'      => $request->addon_ids ?? [],
        ]);

        return response()->json($booking, 201);
    }

    public function show(Booking $booking)
    {
        return response()->json($booking->load('package'));
    }

    public function update(Request $request, Booking $booking)
    {
        $booking->update($request->only(['status', 'notes', 'booking_date', 'slot_time']));
        return response()->json($booking->fresh());
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();
        return response()->json(['message' => 'Booking dihapus.']);
    }
}
