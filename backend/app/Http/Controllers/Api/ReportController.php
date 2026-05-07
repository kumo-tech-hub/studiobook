<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Expense;
use App\Exports\FinancialReportExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->start_date ? Carbon::parse($request->start_date)->startOfDay() : Carbon::now()->startOfMonth();
        $endDate   = $request->end_date   ? Carbon::parse($request->end_date)->endOfDay()     : Carbon::now()->endOfDay();

        // Periode sebelumnya untuk tren (durasi yang sama)
        $daysDiff  = $startDate->diffInDays($endDate) + 1;
        $prevStart = $startDate->copy()->subDays($daysDiff);
        $prevEnd   = $startDate->copy()->subDay()->endOfDay();

        // ─── TAB PEMASUKAN ────────────────────────────────────────────
        $incomeBookings = Booking::where('status', 'Lunas')
            ->whereBetween('booking_date', [$startDate, $endDate])
            ->orderByDesc('booking_date')
            ->get();

        $totalRevenue = $incomeBookings->sum('total_price');
        $totalCount   = $incomeBookings->count();
        $avgValue     = $totalCount > 0 ? round($totalRevenue / $totalCount) : 0;

        $prevRevenue  = Booking::where('status', 'Lunas')
            ->whereBetween('booking_date', [$prevStart, $prevEnd])
            ->sum('total_price');
        $revenueTrend = $prevRevenue > 0
            ? round((($totalRevenue - $prevRevenue) / $prevRevenue) * 100, 1) : 0;

        $prevCount    = Booking::where('status', 'Lunas')
            ->whereBetween('booking_date', [$prevStart, $prevEnd])
            ->count();
        $countTrend   = $prevCount > 0
            ? round((($totalCount - $prevCount) / $prevCount) * 100, 1) : 0;

        // Paket terpopuler
        $popularPackages = Booking::where('status', 'Lunas')
            ->whereBetween('booking_date', [$startDate, $endDate])
            ->selectRaw('package_name, COUNT(*) as count, SUM(total_price) as revenue')
            ->groupBy('package_name')
            ->orderByDesc('count')
            ->get()
            ->map(fn($p) => [
                'name'    => $p->package_name,
                'count'   => $p->count,
                'revenue' => 'Rp ' . number_format($p->revenue, 0, ',', '.'),
            ]);

        $financials = $incomeBookings->map(fn($b) => [
            'id'       => $b->id,
            'date'     => $b->booking_date->format('d M Y'),
            'customer' => $b->customer_name,
            'type'     => $b->package_name,
            'amount'   => '+Rp ' . number_format($b->total_price, 0, ',', '.'),
        ]);

        // ─── TAB BOOKING ──────────────────────────────────────────────
        $allBookings = Booking::whereBetween('booking_date', [$startDate, $endDate])
            ->orderByDesc('booking_date')
            ->get();

        $totalAll    = $allBookings->count();
        $doneCount   = $allBookings->where('status', 'Lunas')->count();
        $pendCount   = $allBookings->where('status', 'Pending')->count();
        $cancelCount = $allBookings->where('status', 'Batal')->count();

        $bookingByPackage = $allBookings
            ->groupBy('package_name')
            ->map(fn($group, $name) => ['name' => $name, 'count' => $group->count()])
            ->values();

        $bookingList = $allBookings->map(fn($b) => [
            'id'       => $b->id,
            'date'     => $b->booking_date->format('d M Y'),
            'customer' => $b->customer_name,
            'type'     => $b->package_name,
            'status'   => $b->status,
            'amount'   => 'Rp ' . number_format($b->total_price, 0, ',', '.'),
        ]);

        return response()->json([
            'pemasukan' => [
                'stats' => [
                    'total_revenue' => $totalRevenue,
                    'revenue_trend' => $revenueTrend,
                    'total_count'   => $totalCount,
                    'count_trend'   => $countTrend,
                    'avg_value'     => $avgValue,
                ],
                'financials'       => $financials,
                'popular_packages' => $popularPackages,
            ],
            'booking' => [
                'stats' => [
                    'total'       => $totalAll,
                    'done'        => $doneCount,
                    'pending'     => $pendCount,
                    'cancelled'   => $cancelCount,
                    'done_pct'    => $totalAll > 0 ? round($doneCount / $totalAll * 100, 1) : 0,
                    'pending_pct' => $totalAll > 0 ? round($pendCount / $totalAll * 100, 1) : 0,
                    'cancel_pct'  => $totalAll > 0 ? round($cancelCount / $totalAll * 100, 1) : 0,
                ],
                'list'             => $bookingList,
                'by_package'       => $bookingByPackage,
            ],
        ]);
    }

    public function export(Request $request)
    {
        $startDate = $request->start_date ? Carbon::parse($request->start_date)->startOfDay() : Carbon::now()->startOfMonth();
        $endDate   = $request->end_date   ? Carbon::parse($request->end_date)->endOfDay()     : Carbon::now()->endOfDay();

        $filename = "Laporan_Keuangan_" . $startDate->format('Ymd') . "_" . $endDate->format('Ymd') . ".xlsx";

        return Excel::download(new FinancialReportExport($startDate, $endDate), $filename);
    }
}
