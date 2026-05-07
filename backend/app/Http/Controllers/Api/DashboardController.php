<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today     = Carbon::today();
        $thisWeek  = [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()];
        $thisMonth = [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()];
        $lastMonth = [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()];

        // ─── STATS CARDS ─────────────────────────────────────────────
        $todayRevenue     = Booking::whereDate('booking_date', $today)->where('status', 'Lunas')->sum('total_price');
        $yesterdayRevenue = Booking::whereDate('booking_date', Carbon::yesterday())->where('status', 'Lunas')->sum('total_price');
        $revenueTrend     = $yesterdayRevenue > 0
            ? round((($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100, 1)
            : ($todayRevenue > 0 ? 100 : 0);

        $totalBookings      = Booking::count();
        $lastMonthBookings  = Booking::whereBetween('booking_date', $lastMonth)->count();
        $thisMonthBookings  = Booking::whereBetween('booking_date', $thisMonth)->count();
        $bookingTrend       = $lastMonthBookings > 0
            ? round((($thisMonthBookings - $lastMonthBookings) / $lastMonthBookings) * 100, 1)
            : 0;

        $pendingToday  = Booking::whereDate('booking_date', $today)->where('status', 'Pending')->count();
        $doneToday     = Booking::whereDate('booking_date', $today)->where('status', 'Lunas')->count();

        // ─── JADWAL HARI INI ──────────────────────────────────────────
        $todaySchedule = Booking::with('package')
            ->whereDate('booking_date', $today)
            ->whereIn('status', ['Pending', 'Lunas'])
            ->orderBy('slot_time')
            ->get()
            ->map(fn($b) => [
                'id'           => $b->id,
                'name'         => $b->customer_name,
                'package'      => $b->package_name,
                'date'         => $b->booking_date->format('d M Y'),
                'slot_time'    => $b->slot_time,
                'status'       => $b->status,
            ]);

        // ─── BOOKING TERBARU ──────────────────────────────────────────
        $recentBookings = Booking::latest()
            ->take(6)
            ->get()
            ->map(fn($b) => [
                'id'           => $b->booking_code,
                'name'         => $b->customer_name,
                'date'         => $b->booking_date->format('d M Y'),
                'package'      => $b->package_name,
                'status'       => $b->status,
            ]);

        // ─── GRAFIK: Pemasukan per Minggu ─────────────────────────────
        $dayNames = ['Sen' => 1, 'Sel' => 2, 'Rab' => 3, 'Kam' => 4, 'Jum' => 5, 'Sab' => 6, 'Min' => 0];
        $weeklyRaw = Booking::where('status', 'Lunas')
            ->whereBetween('booking_date', $thisWeek)
            ->selectRaw('DAYOFWEEK(booking_date) as dow, SUM(total_price) as total')
            ->groupBy('dow')
            ->pluck('total', 'dow')
            ->toArray();

        // DAYOFWEEK: 1=Sun, 2=Mon, ..., 7=Sat
        $dowMap = [2 => 'Sen', 3 => 'Sel', 4 => 'Rab', 5 => 'Kam', 6 => 'Jum', 7 => 'Sab', 1 => 'Min'];
        $chartWeekly = array_map(fn($label, $dow) => [
            'label'  => $label,
            'income' => round(($weeklyRaw[$dow] ?? 0) / 1000), // dalam ribuan
        ], array_values($dowMap), array_keys($dowMap));

        // ─── GRAFIK: Pemasukan per Bulan (minggu) ─────────────────────
        $monthlyByWeek = Booking::where('status', 'Lunas')
            ->whereBetween('booking_date', $thisMonth)
            ->selectRaw('WEEK(booking_date) - WEEK(DATE_FORMAT(booking_date, "%Y-%m-01")) + 1 as week_num, SUM(total_price) as total')
            ->groupBy('week_num')
            ->orderBy('week_num')
            ->pluck('total', 'week_num')
            ->toArray();

        $chartMonthly = [];
        for ($w = 1; $w <= 4; $w++) {
            $chartMonthly[] = ['label' => "Mg $w", 'income' => round(($monthlyByWeek[$w] ?? 0) / 1000)];
        }

        // ─── GRAFIK: Pemasukan per Tahun (bulan) ──────────────────────
        $monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
        $yearlyRaw = Booking::where('status', 'Lunas')
            ->whereYear('booking_date', Carbon::now()->year)
            ->selectRaw('MONTH(booking_date) as month_num, SUM(total_price) as total')
            ->groupBy('month_num')
            ->pluck('total', 'month_num')
            ->toArray();

        $chartYearly = [];
        for ($m = 1; $m <= 12; $m++) {
            $chartYearly[] = ['label' => $monthNames[$m - 1], 'income' => round(($yearlyRaw[$m] ?? 0) / 1000)];
        }

        return response()->json([
            'stats' => [
                'today_revenue'   => $todayRevenue,
                'revenue_trend'   => $revenueTrend,
                'total_bookings'  => $totalBookings,
                'booking_trend'   => $bookingTrend,
                'pending_today'   => $pendingToday,
                'done_today'      => $doneToday,
            ],
            'chart' => [
                'weekly'  => $chartWeekly,
                'monthly' => $chartMonthly,
                'yearly'  => $chartYearly,
            ],
            'today_schedule'  => $todaySchedule,
            'recent_bookings' => $recentBookings,
        ]);
    }
}
