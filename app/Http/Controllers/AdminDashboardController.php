<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Mitra;
use App\Models\Pesanan;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Depot statistics
        $totalDepots = Mitra::count();
        $pendingDepots = Mitra::pending()->count();
        $approvedDepots = Mitra::approved()->count();
        $rejectedDepots = Mitra::rejected()->count();

        // Order statistics
        $today = Carbon::today();
        $weekStart = Carbon::now()->startOfWeek();
        $monthStart = Carbon::now()->startOfMonth();

        $ordersToday = Pesanan::whereDate('created_at', $today)
            ->where('Status_Pesanan', '!=', 'Dibatalkan')
            ->count();

        $ordersThisWeek = Pesanan::where('created_at', '>=', $weekStart)
            ->where('Status_Pesanan', '!=', 'Dibatalkan')
            ->count();

        $ordersThisMonth = Pesanan::where('created_at', '>=', $monthStart)
            ->where('Status_Pesanan', '!=', 'Dibatalkan')
            ->count();

        // Revenue statistics
        $revenueToday = Pesanan::whereDate('created_at', $today)
            ->where('Status_Pesanan', 'Selesai')
            ->sum('Harga');

        $revenueThisWeek = Pesanan::where('created_at', '>=', $weekStart)
            ->where('Status_Pesanan', 'Selesai')
            ->sum('Harga');

        $revenueThisMonth = Pesanan::where('created_at', '>=', $monthStart)
            ->where('Status_Pesanan', 'Selesai')
            ->sum('Harga');

        // Chart data: Last 30 days orders
        $last30Days = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $count = Pesanan::whereDate('created_at', $date)
                ->where('Status_Pesanan', '!=', 'Dibatalkan')
                ->count();

            $last30Days[] = [
                'date' => $date->format('Y-m-d'),
                'label' => $date->format('d M'),
                'count' => $count
            ];
        }

        // Orders by kelurahan (top 10)
        $ordersByKelurahan = Pesanan::join('produk', 'pesanan.ID_Produk', '=', 'produk.ID_Produk')
            ->join('mitra', 'produk.ID_Mitra', '=', 'mitra.ID_Mitra')
            ->join('kelurahan', 'mitra.ID_KELURAHAN', '=', 'kelurahan.ID_KELURAHAN')
            ->select('kelurahan.Nama_Kel', DB::raw('count(*) as total'))
            ->where('pesanan.Status_Pesanan', '!=', 'Dibatalkan')
            ->groupBy('kelurahan.ID_KELURAHAN', 'kelurahan.Nama_Kel')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        // Recent pending depots
        $recentPendingDepots = Mitra::pending()
            ->with(['kelurahan.kecamatan'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Recent orders
        $recentOrders = Pesanan::with(['produk.mitra.kelurahan', 'pelanggan.user'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'depots' => [
                    'total' => $totalDepots,
                    'pending' => $pendingDepots,
                    'approved' => $approvedDepots,
                    'rejected' => $rejectedDepots,
                ],
                'orders' => [
                    'today' => $ordersToday,
                    'week' => $ordersThisWeek,
                    'month' => $ordersThisMonth,
                ],
                'revenue' => [
                    'today' => $revenueToday,
                    'week' => $revenueThisWeek,
                    'month' => $revenueThisMonth,
                ],
            ],
            'chartData' => [
                'last30Days' => $last30Days,
                'byKelurahan' => $ordersByKelurahan,
            ],
            'recentPendingDepots' => $recentPendingDepots,
            'recentOrders' => $recentOrders,
        ]);
    }
}
