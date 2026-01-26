<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class PelangganOrderController extends Controller
{
    public function index(Request $request)
    {
        $pelanggan = Auth::user()->pelanggan;

        $ordersQuery = Pesanan::where('ID_Pelanggan', $pelanggan->ID_Pelanggan)
            ->with(['produk.mitra', 'produk', 'invoice'])
            ->orderBy('Tanggal_Pesan', 'desc');

        // Apply time-based filter
        if ($request->has('time_filter') && $request->time_filter) {
            $now = Carbon::now('Asia/Jakarta');

            switch ($request->time_filter) {
                case 'today':
                    $ordersQuery->whereDate('Tanggal_Pesan', $now->toDateString());
                    break;
                case 'week':
                    $ordersQuery->whereBetween('Tanggal_Pesan', [
                        $now->startOfWeek()->toDateString(),
                        $now->endOfWeek()->toDateString()
                    ]);
                    break;
                case 'month':
                    $ordersQuery->whereMonth('Tanggal_Pesan', $now->month)
                        ->whereYear('Tanggal_Pesan', $now->year);
                    break;
            }
        }

        $orders = $ordersQuery->paginate(15);

        return Inertia::render('Pelanggan/Orders', [
            'orders' => $orders,
            'pelanggan' => $pelanggan
        ]);
    }

    public function cancel($id)
    {
        $pelanggan = Auth::user()->pelanggan;

        $order = Pesanan::where('ID_Pesanan', $id)
            ->where('ID_Pelanggan', $pelanggan->ID_Pelanggan)
            ->firstOrFail();

        // Only allow cancellation for pending payments
        if ($order->Status_Pembayaran === 'Pending') {
            $order->Status_Pesanan = 'Dibatalkan';
            $order->Status_Pembayaran = 'Failed';
            $order->save();

            return redirect()->back()->with('success', 'Pesanan berhasil dibatalkan');
        }

        return redirect()->back()->with('error', 'Pesanan tidak dapat dibatalkan');
    }

    public function continuePayment($id)
    {
        $pelanggan = Auth::user()->pelanggan;

        $order = Pesanan::where('ID_Pesanan', $id)
            ->where('ID_Pelanggan', $pelanggan->ID_Pelanggan)
            ->firstOrFail();

        // Check if order has pending payment and snap token
        if ($order->Status_Pembayaran === 'Pending' && $order->snap_token) {
            return response()->json([
                'snap_token' => $order->snap_token
            ]);
        }

        return response()->json([
            'error' => 'Token pembayaran tidak tersedia'
        ], 400);
    }
}
