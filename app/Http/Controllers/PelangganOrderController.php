<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PelangganOrderController extends Controller
{
    public function index()
    {
        $pelanggan = Auth::user()->pelanggan;

        $orders = Pesanan::where('ID_Pelanggan', $pelanggan->ID_Pelanggan)
            ->with(['produk.mitra', 'produk'])
            ->orderBy('Tanggal_Pesan', 'desc')
            ->get();

        return Inertia::render('Pelanggan/Orders', [
            'orders' => $orders,
            'pelanggan' => $pelanggan
        ]);
    }
}
