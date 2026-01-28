<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pesanan;
use App\Models\Mitra;
use Illuminate\Support\Facades\DB;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Pesanan::with(['mitra.kelurahan.kecamatan', 'pelanggan.user']);

        // Filter by depot
        if ($request->has('depot_id') && $request->depot_id) {
            $query->where('ID_Mitra', $request->depot_id);
        }

        // Filter by kelurahan
        if ($request->has('kelurahan_id') && $request->kelurahan_id) {
            $query->whereHas('mitra', function ($q) use ($request) {
                $q->where('ID_KELURAHAN', $request->kelurahan_id);
            });
        }

        // Filter by kecamatan
        if ($request->has('kecamatan_id') && $request->kecamatan_id) {
            $query->whereHas('mitra.kelurahan', function ($q) use ($request) {
                $q->where('ID_KECAMATAN', $request->kecamatan_id);
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('Status_Pesanan', $request->status);
        }

        // Filter by payment method
        if ($request->has('payment_method') && $request->payment_method) {
            $query->where('Metode_Pembayaran', $request->payment_method);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Get statistics based on current filters
        $stats = [
            'total_orders' => (clone $query)->count(),
            'total_revenue' => (clone $query)->where('Status_Pesanan', 'Selesai')->sum('Harga'),
            'pending' => (clone $query)->where('Status_Pesanan', 'Menunggu Konfirmasi')->count(),
            'accepted' => (clone $query)->where('Status_Pesanan', 'Diterima')->count(),
            'completed' => (clone $query)->where('Status_Pesanan', 'Selesai')->count(),
            'cancelled' => (clone $query)->where('Status_Pesanan', 'Dibatalkan')->count(),
        ];

        $orders = $query->orderBy('created_at', 'desc')->paginate(20);

        // Get all depots for filter dropdown
        $depots = Mitra::approved()
            ->select('ID_Mitra', 'Nama_Mitra')
            ->orderBy('Nama_Mitra')
            ->get();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'depots' => $depots,
            'filters' => $request->only([
                'depot_id',
                'kelurahan_id',
                'kecamatan_id',
                'status',
                'payment_method',
                'date_from',
                'date_to'
            ]),
        ]);
    }

    public function show($id)
    {
        $order = Pesanan::with([
            'mitra.kelurahan.kecamatan',
            'pelanggan.user',
            'produk'
        ])->findOrFail($id);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }
}
