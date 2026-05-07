<?php

namespace App\Exports;

use App\Models\Booking;
use App\Models\Expense;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class FinancialReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate   = $endDate;
    }

    /**
    * Ambil dan gabungkan data
    */
    public function collection()
    {
        $bookings = Booking::where('status', 'Lunas')
            ->whereBetween('booking_date', [$this->startDate, $this->endDate])
            ->get();

        $expenses = Expense::whereBetween('expense_date', [$this->startDate, $this->endDate])
            ->get();

        $all = collect();

        foreach ($bookings as $b) {
            $all->push([
                'date'   => $b->booking_date,
                'desc'   => "Booking: {$b->customer_name} ({$b->package_name})",
                'type'   => 'Pemasukan',
                'amount' => $b->total_price,
            ]);
        }

        foreach ($expenses as $e) {
            $all->push([
                'date'   => $e->expense_date,
                'desc'   => "[{$e->category}] {$e->description}",
                'type'   => 'Pengeluaran',
                'amount' => $e->amount,
            ]);
        }

        // Urutkan berdasarkan tanggal
        $sorted = $all->sortBy('date');

        // Tambahkan baris total di paling bawah
        $totalIncome = $bookings->sum('total_price');
        $totalExpense = $expenses->sum('amount');

        $sorted->push([
            'date'   => null,
            'desc'   => 'TOTAL PEMASUKAN',
            'type'   => '',
            'amount' => $totalIncome,
        ]);

        $sorted->push([
            'date'   => null,
            'desc'   => 'TOTAL PENGELUARAN',
            'type'   => '',
            'amount' => $totalExpense,
        ]);

        $sorted->push([
            'date'   => null,
            'desc'   => 'LABA BERSIH',
            'type'   => '',
            'amount' => $totalIncome - $totalExpense,
        ]);

        return $sorted;
    }

    /**
    * Header tabel
    */
    public function headings(): array
    {
        return [
            ['LAPORAN KEUANGAN STUDIOBOOK'],
            ['Periode: ' . $this->startDate->format('d M Y') . ' - ' . $this->endDate->format('d M Y')],
            [''],
            ['Tanggal', 'Keterangan / Transaksi', 'Tipe', 'Nominal (IDR)']
        ];
    }

    /**
    * Mapping baris data
    */
    public function map($row): array
    {
        return [
            $row['date'] ? $row['date']->format('d/m/Y') : '',
            $row['desc'],
            $row['type'],
            $row['amount'],
        ];
    }

    /**
    * Styling Excel
    */
    public function styles(Worksheet $sheet)
    {
        // Judul Besar
        $sheet->mergeCells('A1:D1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);

        // Sub Judul (Periode)
        $sheet->mergeCells('A2:D2');

        // Header Tabel (Baris 4)
        $sheet->getStyle('A4:D4')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '1E293B']]
        ]);

        // Format angka kolom D (Nominal)
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle('D5:D' . $lastRow)->getNumberFormat()->setFormatCode('#,##0');

        // Highlight baris Total (3 baris terakhir)
        $sheet->getStyle('A' . ($lastRow - 2) . ':D' . $lastRow)->getFont()->setBold(true);
        $sheet->getStyle('A' . ($lastRow - 2) . ':D' . ($lastRow - 2))->getFill()->applyFromArray(['fillType' => 'solid', 'startColor' => ['rgb' => 'F1F5F9']]);
        $sheet->getStyle('A' . ($lastRow - 1) . ':D' . ($lastRow - 1))->getFill()->applyFromArray(['fillType' => 'solid', 'startColor' => ['rgb' => 'F1F5F9']]);
        $sheet->getStyle('A' . $lastRow . ':D' . $lastRow)->getFill()->applyFromArray(['fillType' => 'solid', 'startColor' => ['rgb' => 'E2E8F0']]);

        return [];
    }
}
