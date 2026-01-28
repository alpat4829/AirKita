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

        // Check if there's an existing pending order for this product
        $existingOrder = Pesanan::where('ID_Pelanggan', $pelanggan->ID_Pelanggan)
            ->where('ID_Produk', $produk->ID_Produk)
            ->where('Status_Pembayaran', 'Pending')
            ->where('Status_Pesanan', 'Menunggu Pembayaran')
            ->whereDate('Tanggal_Pesan', today())
            ->first();

        if ($existingOrder) {
            // Reuse existing order if snap_token is still valid
            if ($existingOrder->snap_token) {
                return response()->json([
                    'snap_token' => $existingOrder->snap_token,
                    'order_id' => $existingOrder->ID_Pesanan
                ]);
            }
        }

        // Calculate total price
        $totalHarga = $produk->Harga * $request->jumlah;

        // Create or update order
        $pesanan = $existingOrder ?? Pesanan::create([
            'ID_Pelanggan' => $pelanggan->ID_Pelanggan,
            'ID_Produk' => $produk->ID_Produk,
            'Tanggal_Pesan' => now(),
            'Status_Pesanan' => 'Menunggu Pembayaran',
            'Harga' => $totalHarga,
            'Jumlah' => $request->jumlah,
            'Status_Pembayaran' => 'Pending',
            'Metode_Pembayaran' => $request->payment_method ?? 'Digital'
        ]);

        // Handle 'Saldo' payment method
        if ($request->payment_method === 'Saldo') {
            if ($pelanggan->saldo >= $totalHarga) {
                // Deduct saldo
                $pelanggan->decrement('saldo', $totalHarga);

                // Update order to Paid
                $pesanan->update([
                    'Status_Pembayaran' => 'Paid',
                    'Status_Pesanan' => 'Diproses',
                    'Tanggal_Pembayaran' => now()
                ]);

                // Generate invoices manually since we don't go through payment callback
                try {
                    $invoiceService = app(\App\Services\InvoiceService::class);
                    $invoiceService->createUserInvoice($pesanan);
                    $invoiceService->createMitraInvoice($pesanan);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Error generating invoice for saldo payment: ' . $e->getMessage());
                }

                return response()->json([
                    'message' => 'Pembayaran berhasil menggunakan Saldo',
                    'order_id' => $pesanan->ID_Pesanan,
                    'status' => 'success'
                ]);
            } else {
                // If saldo insufficient, revert input or return error
                // In this flow, we assume frontend checked it, but backend validation is crucial
                if (!$existingOrder) {
                    $pesanan->delete(); // Cleanup if creation was part of this request
                }
                return response()->json(['error' => 'Saldo tidak mencukupi'], 400);
            }
        }

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
