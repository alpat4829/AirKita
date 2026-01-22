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
            ->findOrFail($id);

        $pesanan->update([
            'Status_Pesanan' => 'Dibatalkan'
        ]);

        return response()->json(['message' => 'Pesanan ditolak']);
    }

    public function history(Request $request)
    {
        $mitra = Auth::user()->mitra;

        $query = Pesanan::whereHas('produk', function ($q) use ($mitra) {
            $q->where('ID_Mitra', $mitra->ID_Mitra);
        })
            ->with(['pelanggan.kelurahan', 'produk']);

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
