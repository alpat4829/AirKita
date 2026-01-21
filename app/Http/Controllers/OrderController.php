<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'id_produk' => 'required|exists:produk,ID_Produk',
            'jumlah' => 'required|integer|min:1'
        ]);

        $pelanggan = Auth::user()->pelanggan;
        $produk = Produk::findOrFail($request->id_produk);

        // Calculate total price
        $totalHarga = $produk->Harga * $request->jumlah;

        // Create order
        $pesanan = Pesanan::create([
            'ID_Pelanggan' => $pelanggan->ID_Pelanggan,
            'ID_Produk' => $produk->ID_Produk,
            'Tanggal_Pesan' => now(),
            'Status_Pesanan' => 'Menunggu Pembayaran',
            'Harga' => $totalHarga,
            'Jumlah' => $request->jumlah,
            'Status_Pembayaran' => 'Pending',
            'Metode_Pembayaran' => 'Digital'
        ]);

        // Generate Midtrans snap_token
        $snapToken = $this->generateMidtransToken($pesanan, $pelanggan, $produk);

        $pesanan->update(['snap_token' => $snapToken]);

        return response()->json([
            'snap_token' => $snapToken,
            'order_id' => $pesanan->ID_Pesanan
        ]);
    }

    private function generateMidtransToken($pesanan, $pelanggan, $produk)
    {
        // Set Midtrans configuration
        \Midtrans\Config::$serverKey = config('midtrans.server_key', 'SB-Mid-server-YOUR_SERVER_KEY');
        \Midtrans\Config::$isProduction = config('midtrans.is_production', false);
        \Midtrans\Config::$isSanitized = true;
        \Midtrans\Config::$is3ds = true;

        $params = [
            'transaction_details' => [
                'order_id' => 'ORDER-' . $pesanan->ID_Pesanan . '-' . time(),
                'gross_amount' => $pesanan->Harga,
            ],
            'customer_details' => [
                'first_name' => $pelanggan->Nama,
                'email' => $pelanggan->Email,
                'phone' => $pelanggan->No_HP,
            ],
            'item_details' => [
                [
                    'id' => $produk->ID_Produk,
                    'price' => $produk->Harga,
                    'quantity' => $pesanan->Jumlah,
                    'name' => $produk->Nama_Produk
                ]
            ]
        ];

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            return $snapToken;
        } catch (\Exception $e) {
            // For development, return a dummy token if Midtrans is not configured
            return 'DUMMY-TOKEN-' . time();
        }
    }

    public function reorder($id)
    {
        $pesanan = Pesanan::with('produk')->findOrFail($id);
        $pelanggan = Auth::user()->pelanggan;

        // Verify this order belongs to the logged-in customer
        if ($pesanan->ID_Pelanggan != $pelanggan->ID_Pelanggan) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Create new order with same details
        $newPesanan = Pesanan::create([
            'ID_Pelanggan' => $pesanan->ID_Pelanggan,
            'ID_Produk' => $pesanan->ID_Produk,
            'Tanggal_Pesan' => now(),
            'Status_Pesanan' => 'Menunggu Pembayaran',
            'Harga' => $pesanan->Harga,
            'Jumlah' => $pesanan->Jumlah,
            'Status_Pembayaran' => 'Pending',
            'Metode_Pembayaran' => 'Digital'
        ]);

        // Generate new snap token
        $snapToken = $this->generateMidtransToken($newPesanan, $pelanggan, $pesanan->produk);
        $newPesanan->update(['snap_token' => $snapToken]);

        return response()->json([
            'snap_token' => $snapToken,
            'order_id' => $newPesanan->ID_Pesanan
        ]);
    }
}
