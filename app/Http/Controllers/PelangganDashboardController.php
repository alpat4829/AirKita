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
    public function index()
    {
        $pelanggan = Auth::user()->pelanggan;

        if (!$pelanggan) {
            return redirect()->route('dashboard')->with('error', 'Data pelanggan tidak ditemukan');
        }

        $kelurahanId = $pelanggan->ID_KELURAHAN;

        // Get depots in same kelurahan that are active and currently open
        $depots = Mitra::where('ID_KELURAHAN', $kelurahanId)
            ->where('Status', 'active')
            ->with('kelurahan.kecamatan')
            ->get();

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
            'pelanggan' => $pelanggan->load('kelurahan')
        ]);
    }

    public function show($id)
    {
        $depot = Mitra::with(['produk', 'kelurahan'])->findOrFail($id);
        $pelanggan = Auth::user()->pelanggan;

        return Inertia::render('Pelanggan/DepotDetail', [
            'depot' => $depot,
            'pelanggan' => $pelanggan
        ]);
    }
}
