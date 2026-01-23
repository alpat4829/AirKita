<?php

namespace App\Http\Controllers;

use App\Models\Mitra;
use App\Models\Pesanan;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class MitraDashboardController extends Controller
{
    public function index()
    {
        $mitra = Auth::user()->mitra;

        if (!$mitra) {
            return redirect()->route('dashboard')->with('error', 'Data mitra tidak ditemukan');
        }

        // Get today's orders - ONLY PAID ORDERS that are waiting to be accepted
        $todayOrders = Pesanan::whereHas('produk', function ($query) use ($mitra) {
            $query->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->whereDate('Tanggal_Pesan', Carbon::today())
            ->where('Status_Pembayaran', 'Paid') // Only show paid orders
            ->where('Status_Pesanan', 'Diproses') // Only show orders waiting to be accepted
            ->with(['pelanggan.kelurahan', 'produk'])
            ->orderBy('Tanggal_Pesan', 'desc')
            ->get();

        // Detailed Statistics
        // Orders Today - ALL paid orders created today (regardless of status)
        $ordersToday = Pesanan::whereHas('produk', function ($query) use ($mitra) {
            $query->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->whereDate('Tanggal_Pesan', Carbon::today())
            ->where('Status_Pembayaran', 'Paid')
            ->count();

        $ordersThisMonth = Pesanan::whereHas('produk', function ($query) use ($mitra) {
            $query->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->whereMonth('Tanggal_Pesan', Carbon::now()->month)
            ->whereYear('Tanggal_Pesan', Carbon::now()->year)
            ->where('Status_Pembayaran', 'Paid')
            ->count();

        // Total Revenue (all time)
        $totalRevenue = Pesanan::whereHas('produk', function ($query) use ($mitra) {
            $query->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->where('Status_Pembayaran', 'Paid')
            ->sum('Harga');

        // Today's Revenue
        $todayRevenue = Pesanan::whereHas('produk', function ($query) use ($mitra) {
            $query->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->whereDate('Tanggal_Pesan', Carbon::today())
            ->where('Status_Pembayaran', 'Paid')
            ->sum('Harga');

        // Order Status Breakdown
        $pendingOrders = Pesanan::whereHas('produk', function ($query) use ($mitra) {
            $query->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->where('Status_Pembayaran', 'Paid')
            ->where('Status_Pesanan', 'Diproses')
            ->count();

        $completedOrders = Pesanan::whereHas('produk', function ($query) use ($mitra) {
            $query->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->where('Status_Pembayaran', 'Paid')
            ->where('Status_Pesanan', 'Selesai')
            ->count();

        // Chart Data - Last 7 days revenue and orders
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);

            $dayRevenue = Pesanan::whereHas('produk', function ($query) use ($mitra) {
                $query->where('ID_Mitra', $mitra->ID_Mitra);
            })
                ->whereDate('Tanggal_Pesan', $date)
                ->where('Status_Pembayaran', 'Paid')
                ->sum('Harga');

            $dayOrders = Pesanan::whereHas('produk', function ($query) use ($mitra) {
                $query->where('ID_Mitra', $mitra->ID_Mitra);
            })
                ->whereDate('Tanggal_Pesan', $date)
                ->where('Status_Pembayaran', 'Paid')
                ->count();

            $chartData[] = [
                'date' => $date->format('d M'),
                'revenue' => $dayRevenue,
                'orders' => $dayOrders,
            ];
        }

        // Check if depot is currently open
        $now = Carbon::now('Asia/Jakarta');

        // Parse operating hours
        $jamBuka = Carbon::createFromFormat('H:i:s', $mitra->Jam_buka, 'Asia/Jakarta');
        $jamTutup = Carbon::createFromFormat('H:i:s', $mitra->Jam_Tutup, 'Asia/Jakarta');
        $currentTime = Carbon::createFromFormat('H:i:s', $now->format('H:i:s'), 'Asia/Jakarta');

        // Check if within operating hours
        $isWithinHours = $currentTime->between($jamBuka, $jamTutup);

        // Check manual override (if exists) - Manual_Status takes priority
        $isOpen = $mitra->Manual_Status !== null ? (bool) $mitra->Manual_Status : $isWithinHours;

        // Get unread orders count (for notification) - Only paid orders
        $unreadOrdersCount = Pesanan::whereHas('produk', function ($query) use ($mitra) {
            $query->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->where('Status_Pembayaran', 'Paid')
            ->where('Status_Pesanan', 'Menunggu Pembayaran')
            ->whereDate('Tanggal_Pesan', Carbon::today())
            ->count();

        return Inertia::render('Mitra/Dashboard', [
            'mitra' => $mitra,
            'todayOrders' => $todayOrders,
            'statistics' => [
                'ordersToday' => $ordersToday,
                'ordersThisMonth' => $ordersThisMonth,
                'totalRevenue' => $totalRevenue,
                'todayRevenue' => $todayRevenue,
                'pendingOrders' => $pendingOrders,
                'completedOrders' => $completedOrders,
            ],
            'chartData' => $chartData,
            'isOpen' => $isOpen,
            'isWithinHours' => $isWithinHours,
            'unreadOrdersCount' => $unreadOrdersCount,
        ]);
    }

    public function toggleStatus()
    {
        $mitra = Auth::user()->mitra;

        // Toggle manual status
        $newStatus = $mitra->Manual_Status === null ? true : !$mitra->Manual_Status;
        $mitra->update(['Manual_Status' => $newStatus]);

        return redirect()->back()->with('success', 'Status depot diupdate');
    }

    public function resetStatus()
    {
        $mitra = Auth::user()->mitra;

        // Reset to automatic
        $mitra->update(['Manual_Status' => null]);

        return redirect()->back()->with('success', 'Status depot kembali otomatis');
    }

    public function updateHours(Request $request)
    {
        $mitra = Auth::user()->mitra;

        $request->validate([
            'jam_buka' => 'required|date_format:H:i',
            'jam_tutup' => 'required|date_format:H:i|after:jam_buka'
        ]);

        $mitra->update([
            'Jam_buka' => $request->jam_buka . ':00',
            'Jam_Tutup' => $request->jam_tutup . ':00'
        ]);

        return redirect()->back()->with('success', 'Jam operasional diupdate');
    }
}
