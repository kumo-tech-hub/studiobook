<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->start_date ? Carbon::parse($request->start_date)->startOfDay() : Carbon::now()->startOfMonth();
        $endDate   = $request->end_date   ? Carbon::parse($request->end_date)->endOfDay()     : Carbon::now()->endOfDay();

        $expenses = Expense::whereBetween('expense_date', [$startDate, $endDate])
            ->orderByDesc('expense_date')
            ->get()
            ->map(fn($e) => [
                'id'          => $e->id,
                'date'        => $e->expense_date->format('d M Y'),
                'raw_date'    => $e->expense_date->format('Y-m-d'),
                'category'    => $e->category,
                'description' => $e->description,
                'amount'      => $e->amount,
                'amount_fmt'  => '-Rp ' . number_format($e->amount, 0, ',', '.'),
            ]);

        $totalExpense = $expenses->sum('amount');

        // Ringkasan per kategori untuk laba rugi
        $byCategory = Expense::whereBetween('expense_date', [$startDate, $endDate])
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->map(fn($e) => [
                'category' => $e->category,
                'total'    => $e->total,
                'total_fmt' => 'Rp ' . number_format($e->total, 0, ',', '.'),
            ]);

        return response()->json([
            'expenses'      => $expenses,
            'total_expense' => $totalExpense,
            'by_category'   => $byCategory,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'expense_date' => 'required|date',
            'category'     => 'required|in:Sewa,Listrik,Bahan,Peralatan,Pemasaran,Lainnya',
            'description'  => 'required|string|max:255',
            'amount'       => 'required|integer|min:1',
        ]);

        $expense = Expense::create($request->only(['expense_date', 'category', 'description', 'amount']));

        return response()->json([
            'id'          => $expense->id,
            'date'        => $expense->expense_date->format('d M Y'),
            'raw_date'    => $expense->expense_date->format('Y-m-d'),
            'category'    => $expense->category,
            'description' => $expense->description,
            'amount'      => $expense->amount,
            'amount_fmt'  => '-Rp ' . number_format($expense->amount, 0, ',', '.'),
        ], 201);
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->json(['message' => 'Pengeluaran dihapus.']);
    }
}
