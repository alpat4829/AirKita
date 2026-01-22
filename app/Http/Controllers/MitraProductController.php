<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MitraProductController extends Controller
{
    public function index()
    {
        $mitra = Auth::user()->mitra;

        $products = Produk::where('ID_Mitra', $mitra->ID_Mitra)
            ->orderBy('created_at', 'desc')
            ->get();

        // Check if depot is currently open
        $now = \Carbon\Carbon::now('Asia/Jakarta');
        $jamBuka = \Carbon\Carbon::createFromFormat('H:i:s', $mitra->Jam_buka, 'Asia/Jakarta');
        $jamTutup = \Carbon\Carbon::createFromFormat('H:i:s', $mitra->Jam_Tutup, 'Asia/Jakarta');
        $currentTime = \Carbon\Carbon::createFromFormat('H:i:s', $now->format('H:i:s'), 'Asia/Jakarta');
        $isWithinHours = $currentTime->between($jamBuka, $jamTutup);
        $isOpen = $mitra->Manual_Status !== null ? (bool) $mitra->Manual_Status : $isWithinHours;

        return Inertia::render('Mitra/Products', [
            'products' => $products,
            'mitra' => $mitra,
            'isOpen' => $isOpen
        ]);
    }

    public function store(Request $request)
    {
        $mitra = Auth::user()->mitra;

        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string'
        ]);

        Produk::create([
            'ID_Mitra' => $mitra->ID_Mitra,
            'Nama_Produk' => $request->nama_produk,
            'Harga' => $request->harga,
            'Deskripsi' => $request->deskripsi
        ]);

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $mitra = Auth::user()->mitra;

        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string'
        ]);

        $product = Produk::where('ID_Mitra', $mitra->ID_Mitra)
            ->findOrFail($id);

        $product->update([
            'Nama_Produk' => $request->nama_produk,
            'Harga' => $request->harga,
            'Deskripsi' => $request->deskripsi
        ]);

        return redirect()->back()->with('success', 'Produk berhasil diupdate');
    }

    public function destroy($id)
    {
        $mitra = Auth::user()->mitra;

        $product = Produk::where('ID_Mitra', $mitra->ID_Mitra)
            ->findOrFail($id);

        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus');
    }
}
