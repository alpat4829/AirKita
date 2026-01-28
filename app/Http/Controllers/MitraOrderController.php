<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MitraOrderController extends Controller
{
    public function accept($id)
    {
        $mitra = Auth::user()->mitra;

        $pesanan = Pesanan::whereHas('produk', function ($query) use ($mitra) {
            $query->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->findOrFail($id);

        $pesanan->update([
            'Status_Pesanan' => 'Diproses Depot'
        ]);

        return response()->json(['message' => 'Pesanan diterima']);
    }

    public function reject($id)
    {
        $mitra = Auth::user()->mitra;

        $pesanan = Pesanan::whereHas('produk', function ($query) use ($mitra) {
            $query->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->with(['pelanggan', 'invoice']) // Ensure invoice is loaded if needed for checks
            ->findOrFail($id);

        \Illuminate\Support\Facades\DB::transaction(function () use ($pesanan, &$message) {
            // Refresh model to get latest status
            $pesanan->refresh();

            \Illuminate\Support\Facades\Log::info('Rejecting Order: ' . $pesanan->ID_Pesanan);
            \Illuminate\Support\Facades\Log::info('Status Pembayaran: ' . $pesanan->Status_Pembayaran);
            \Illuminate\Support\Facades\Log::info('Has Pelanggan: ' . ($pesanan->pelanggan ? 'Yes' : 'No'));

            // Refund logic
            // Check for 'Lunas' OR 'Paid' status effectively
            $status = trim($pesanan->Status_Pembayaran);
            if (($status === 'Lunas' || $status === 'Paid') && $pesanan->pelanggan) {
                $pesanan->pelanggan->increment('saldo', $pesanan->Harga);
                \Illuminate\Support\Facades\Log::info('Refunded: ' . $pesanan->Harga . ' to Pelanggan ID: ' . $pesanan->ID_Pelanggan);
                $message = 'Pesanan ditolak dan dana Rp ' . number_format($pesanan->Harga, 0, ',', '.') . ' telah dikembalikan ke saldo pengguna.';
            } else {
                \Illuminate\Support\Facades\Log::info('Refund Skipped. Status: ' . $status);
                $message = 'Pesanan ditolak';
            }

            $pesanan->update([
                'Status_Pesanan' => 'Dibatalkan'
            ]);
        });

        return response()->json(['message' => $message]);
    }

    public function complete($id)
    {
        $mitra = Auth::user()->mitra;

        $pesanan = Pesanan::whereHas('produk', function ($query) use ($mitra) {
            $query->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->findOrFail($id);

        $pesanan->update([
            'Status_Pesanan' => 'Selesai'
        ]);

        return redirect()->back()->with('success', 'Pesanan berhasil diselesaikan!');
    }

    public function history(Request $request)
    {
        $mitra = Auth::user()->mitra;

        $query = Pesanan::whereHas('produk', function ($q) use ($mitra) {
            $q->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->with(['pelanggan.kelurahan', 'produk', 'invoice']);

        // Time-based filter
        if ($request->has('time_filter') && $request->time_filter) {
            $now = \Carbon\Carbon::now();

            switch ($request->time_filter) {
                case 'today':
                    $query->whereDate('Tanggal_Pesan', $now->toDateString());
                    break;
                case 'week':
                    $query->whereBetween('Tanggal_Pesan', [
                        $now->startOfWeek()->toDateString(),
                        $now->endOfWeek()->toDateString()
                    ]);
                    break;
                case 'month':
                    $query->whereMonth('Tanggal_Pesan', $now->month)
                        ->whereYear('Tanggal_Pesan', $now->year);
                    break;
            }
        }

        // Filter by status if provided
        if ($request->has('status') && $request->status != '') {
            $query->where('Status_Pesanan', $request->status);
        }

        $orders = $query->orderBy('Tanggal_Pesan', 'desc')->paginate(15);

        // Check if depot is currently open
        $now = \Carbon\Carbon::now('Asia/Jakarta');
        $jamBuka = \Carbon\Carbon::createFromFormat('H:i:s', $mitra->Jam_buka, 'Asia/Jakarta');
        $jamTutup = \Carbon\Carbon::createFromFormat('H:i:s', $mitra->Jam_Tutup, 'Asia/Jakarta');
        $currentTime = \Carbon\Carbon::createFromFormat('H:i:s', $now->format('H:i:s'), 'Asia/Jakarta');
        $isWithinHours = $currentTime->between($jamBuka, $jamTutup);
        $isOpen = $mitra->Manual_Status !== null ? (bool) $mitra->Manual_Status : $isWithinHours;

        return inertia('Mitra/OrderHistory', [
            'orders' => $orders,
            'mitra' => $mitra,
            'isOpen' => $isOpen,
            'filters' => $request->only(['time_filter', 'status'])
        ]);
    }
}
