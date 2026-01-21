<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Provinsi;
use App\Models\Kabupaten;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function getProvinsi()
    {
        $provinsi = Provinsi::orderBy('NAMA_PROVINSI')->get();
        return response()->json($provinsi);
    }

    public function getKabupaten($provinsiId)
    {
        $kabupaten = Kabupaten::where('ID_Provinsi', $provinsiId)
            ->orderBy('Nama_Kab')
            ->get();
        return response()->json($kabupaten);
    }

    public function getKecamatan($kabupatenId)
    {
        $kecamatan = Kecamatan::where('ID_Kabupaten', $kabupatenId)
            ->orderBy('Nama_Kec')
            ->get();
        return response()->json($kecamatan);
    }

    public function getKelurahan($kecamatanId)
    {
        $kelurahan = Kelurahan::where('ID_Kecamatan', $kecamatanId)
            ->orderBy('Nama_Kel')
            ->get();
        return response()->json($kelurahan);
    }
}
