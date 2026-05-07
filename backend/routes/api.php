<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\AddonController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

// Public: paket & addon bisa dibaca tanpa login (untuk halaman publik booking)
Route::get('/packages', [PackageController::class, 'index']);
Route::get('/addons', [AddonController::class, 'index']);

// Public: info studio untuk halaman sukses booking (rekening, nama studio)
Route::get('/settings/public', [SettingController::class, 'public']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Admin: Dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'index']);

    // Admin: Reports
    Route::get('/admin/reports', [ReportController::class, 'index']);
    Route::get('/admin/reports/export', [ReportController::class, 'export']);

    // Admin: Expenses
    Route::get('/admin/expenses', [ExpenseController::class, 'index']);
    Route::post('/admin/expenses', [ExpenseController::class, 'store']);
    Route::delete('/admin/expenses/{expense}', [ExpenseController::class, 'destroy']);

    // Admin: Packages CRUD
    Route::post('/admin/packages', [PackageController::class, 'store']);
    Route::put('/admin/packages/{package}', [PackageController::class, 'update']);
    Route::delete('/admin/packages/{package}', [PackageController::class, 'destroy']);
    Route::patch('/admin/packages/{package}/status', [PackageController::class, 'toggleStatus']);

    // Admin: Addons CRUD
    Route::post('/admin/addons', [AddonController::class, 'store']);
    Route::put('/admin/addons/{addon}', [AddonController::class, 'update']);
    Route::delete('/admin/addons/{addon}', [AddonController::class, 'destroy']);
    Route::patch('/admin/addons/{addon}/status', [AddonController::class, 'toggleStatus']);

    // Admin: Schedule (Jam Operasional & Blokir Tanggal)
    Route::get('/admin/schedule', [ScheduleController::class, 'index']);
    Route::post('/admin/schedule/hours', [ScheduleController::class, 'updateHours']);
    Route::post('/admin/schedule/blocked', [ScheduleController::class, 'storeBlocked']);
    Route::delete('/admin/schedule/blocked/{blockedDate}', [ScheduleController::class, 'destroyBlocked']);

    // Admin: Bookings
    Route::get('/admin/bookings', [BookingController::class, 'index']);
    Route::post('/admin/bookings', [BookingController::class, 'store']);
    Route::get('/admin/bookings/{booking}', [BookingController::class, 'show']);
    Route::patch('/admin/bookings/{booking}', [BookingController::class, 'update']);
    Route::delete('/admin/bookings/{booking}', [BookingController::class, 'destroy']);

    // Admin: Settings
    Route::get('/admin/settings', [SettingController::class, 'index']);
    Route::put('/admin/settings', [SettingController::class, 'update']);
});
