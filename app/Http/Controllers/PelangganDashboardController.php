<?php

namespace App\Http\Controllers;

use App\Models\Mitra;
use App\Models\Kelurahan;
use App\Models\Kecamatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PelangganDashboardController extends Controller
{
    public function index(Request $request)
    {
        $pelanggan = Auth::user()->pelanggan;

        if (!$pelanggan) {
            return redirect()->route('dashboard')->with('error', 'Data pelanggan tidak ditemukan');
        }

        $kelurahanId = $pelanggan->ID_KELURAHAN;

        // Calculate order statistics for this customer
        $totalOrders = \App\Models\Pesanan::where('ID_Pelanggan', $pelanggan->ID_Pelanggan)->count();
        $completedOrders = \App\Models\Pesanan::where('ID_Pelanggan', $pelanggan->ID_Pelanggan)
            ->where('Status_Pesanan', 'Selesai')
            ->count();
        $pendingOrders = \App\Models\Pesanan::where('ID_Pelanggan', $pelanggan->ID_Pelanggan)
            ->where('Status_Pesanan', 'Diproses')
            ->count();
        $cancelledOrders = \App\Models\Pesanan::where('ID_Pelanggan', $pelanggan->ID_Pelanggan)
            ->where('Status_Pesanan', 'Dibatalkan')
            ->count();

        // Get depots with filters
        $depotsQuery = Mitra::where('Status', 'active')
            ->with(['kelurahan.kecamatan', 'produk'])
            ->withCount([
                'produk as products_sold' => function ($query) {
                    $query->join('pesanan', 'produk.ID_Produk', '=', 'pesanan.ID_Produk')
                        ->where('pesanan.Status_Pesanan', 'Selesai')
                        ->selectRaw('SUM(pesanan.Jumlah)');
                }
            ]);

        // Apply location filters
        if ($request->has('kelurahan') && $request->kelurahan) {
            $depotsQuery->where('ID_KELURAHAN', $request->kelurahan);
        } else {
            $depotsQuery->where('ID_KELURAHAN', $kelurahanId);
        }

        if ($request->has('kecamatan') && $request->kecamatan) {
            $depotsQuery->whereHas('kelurahan', function ($query) use ($request) {
                $query->where('ID_Kecamatan', $request->kecamatan);
            });
        }

        // Apply best selling sort
        if ($request->has('best_selling') && $request->best_selling === 'true') {
            $depotsQuery->orderBy('products_sold', 'desc');
        }

        $depots = $depotsQuery->paginate(9)->through(function ($depot) {
            // Calculate if depot is currently open
            $now = \Carbon\Carbon::now('Asia/Jakarta');
            $jamBuka = \Carbon\Carbon::createFromFormat('H:i:s', $depot->Jam_buka, 'Asia/Jakarta');
            $jamTutup = \Carbon\Carbon::createFromFormat('H:i:s', $depot->Jam_Tutup, 'Asia/Jakarta');
            $currentTime = \Carbon\Carbon::createFromFormat('H:i:s', $now->format('H:i:s'), 'Asia/Jakarta');

            $isWithinHours = $currentTime->between($jamBuka, $jamTutup);

            // Check manual override - Manual_Status takes priority
            $depot->isOpen = $depot->Manual_Status !== null ? (bool) $depot->Manual_Status : $isWithinHours;

            return $depot;
        });

        // Get all kelurahan in the same kecamatan for filter
        $kecamatanId = $pelanggan->kelurahan->ID_Kecamatan;
        $kelurahanList = Kelurahan::where('ID_Kecamatan', $kecamatanId)->get();

        // Get all kecamatan in the same kabupaten for filter
        $kabupatenId = $pelanggan->kelurahan->kecamatan->ID_Kabupaten;
        $kecamatanList = Kecamatan::where('ID_Kabupaten', $kabupatenId)->get();

        return Inertia::render('Pelanggan/Dashboard', [
            'depots' => $depots,
            'kelurahanList' => $kelurahanList,
            'kecamatanList' => $kecamatanList,
            'pelanggan' => $pelanggan->load('kelurahan'),
            'statistics' => [
                'total' => $totalOrders,
                'completed' => $completedOrders,
                'pending' => $pendingOrders,
                'cancelled' => $cancelledOrders,
            ]
        ]);
    }

    public function show($id)
    {
        $depot = Mitra::with(['produk', 'kelurahan'])->findOrFail($id);
        $pelanggan = Auth::user()->pelanggan;

        // Calculate if depot is currently open
        $now = \Carbon\Carbon::now('Asia/Jakarta');
        $jamBuka = \Carbon\Carbon::createFromFormat('H:i:s', $depot->Jam_buka, 'Asia/Jakarta');
        $jamTutup = \Carbon\Carbon::createFromFormat('H:i:s', $depot->Jam_Tutup, 'Asia/Jakarta');
        $currentTime = \Carbon\Carbon::createFromFormat('H:i:s', $now->format('H:i:s'), 'Asia/Jakarta');

        $isWithinHours = $currentTime->between($jamBuka, $jamTutup);
        $depot->isOpen = $depot->Manual_Status !== null ? (bool) $depot->Manual_Status : $isWithinHours;

        return Inertia::render('Pelanggan/DepotDetail', [
            'depot' => $depot,
            'pelanggan' => $pelanggan
        ]);
    }
}
