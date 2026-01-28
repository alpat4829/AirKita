<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Mitra;
use Illuminate\Support\Facades\Auth;

class AdminDepotController extends Controller
{
    public function index(Request $request)
    {
        $query = Mitra::with(['kelurahan.kecamatan', 'user']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('approval_status', $request->status);
        }

        // Filter by kelurahan
        if ($request->has('kelurahan_id') && $request->kelurahan_id) {
            $query->where('ID_KELURAHAN', $request->kelurahan_id);
        }

        // Filter by kecamatan
        if ($request->has('kecamatan_id') && $request->kecamatan_id) {
            $query->whereHas('kelurahan', function ($q) use ($request) {
                $q->where('ID_KECAMATAN', $request->kecamatan_id);
            });
        }

        // Search by name or owner
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('Nama_Mitra', 'like', "%{$search}%")
                    ->orWhere('Pemilik', 'like', "%{$search}%");
            });
        }

        $depots = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Depots/Index', [
            'depots' => $depots,
            'filters' => $request->only(['status', 'kelurahan_id', 'kecamatan_id', 'search']),
        ]);
    }

    public function show($id)
    {
        $depot = Mitra::with([
            'kelurahan.kecamatan.kabupaten.provinsi',
            'user',
            'produk',
            'verifier'
        ])->findOrFail($id);

        return Inertia::render('Admin/Depots/Show', [
            'depot' => $depot,
        ]);
    }

    public function approve($id)
    {
        $depot = Mitra::findOrFail($id);

        if ($depot->approval_status === 'approved') {
            return back()->with('error', 'Depot sudah disetujui sebelumnya.');
        }

        $depot->update([
            'approval_status' => 'approved',
            'verified_at' => now(),
            'verified_by' => Auth::id(),
            'rejection_reason' => null,
        ]);

        return back()->with('success', 'Depot berhasil disetujui!');
    }

    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $depot = Mitra::findOrFail($id);

        if ($depot->approval_status === 'rejected') {
            return back()->with('error', 'Depot sudah ditolak sebelumnya.');
        }

        $depot->update([
            'approval_status' => 'rejected',
            'verified_at' => now(),
            'verified_by' => Auth::id(),
            'rejection_reason' => $request->reason,
        ]);

        return back()->with('success', 'Depot berhasil ditolak.');
    }
}
