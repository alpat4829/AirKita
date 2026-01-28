<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Services\InvoiceService;
use App\Helpers\InvoiceHasher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    /**
     * Display invoices for pelanggan
     */
    public function pelangganIndex()
    {
        $pelanggan = Auth::user()->pelanggan;

        $invoices = Invoice::where('id_pelanggan', $pelanggan->ID_Pelanggan)
            ->where('invoice_type', 'user')
            ->with(['pesanan.produk.mitra'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Pelanggan/Invoices/Index', [
            'invoices' => $invoices
        ]);
    }

    /**
     * Display invoices for mitra
     */
    public function mitraIndex()
    {
        $mitra = Auth::user()->mitra;

        $invoices = Invoice::where('id_mitra', $mitra->ID_Mitra)
            ->where('invoice_type', 'mitra')
            ->with(['pesanan.produk', 'pelanggan'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Mitra/Invoices/Index', [
            'invoices' => $invoices
        ]);
    }

    /**
     * Show invoice detail by hashed ID
     */
    public function show($hashedId)
    {
        $orderId = InvoiceHasher::decode($hashedId);
        if (!$orderId) {
            abort(404, 'Invoice not found');
        }

        $invoice = Invoice::with(['pesanan.produk.mitra', 'pelanggan', 'mitra'])
            ->where('id_pesanan', $orderId)
            ->firstOrFail();

        // Check authorization
        $user = Auth::user();
        if ($user->pelanggan && $invoice->id_pelanggan != $user->pelanggan->ID_Pelanggan) {
            abort(403, 'Unauthorized');
        }
        if ($user->mitra && $invoice->id_mitra != $user->mitra->ID_Mitra) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice
        ]);
    }

    /**
     * Download invoice as PDF by hashed ID
     */
    public function download($hashedId)
    {
        $orderId = InvoiceHasher::decode($hashedId);
        if (!$orderId) {
            abort(404, 'Invoice not found');
        }

        $invoice = Invoice::with(['pesanan.produk.mitra', 'pelanggan', 'mitra'])
            ->where('id_pesanan', $orderId)
            ->firstOrFail();

        // Check authorization
        $user = Auth::user();
        if ($user->pelanggan && $invoice->id_pelanggan != $user->pelanggan->ID_Pelanggan) {
            abort(403, 'Unauthorized');
        }
        if ($user->mitra && $invoice->id_mitra != $user->mitra->ID_Mitra) {
            abort(403, 'Unauthorized');
        }

        $pdf = $this->invoiceService->generatePDF($invoice);

        return $pdf->download('invoice-' . $invoice->invoice_number . '.pdf');
    }

    /**
     * View invoice as PDF in browser by hashed ID
     */
    public function view($hashedId)
    {
        $orderId = InvoiceHasher::decode($hashedId);
        if (!$orderId) {
            abort(404, 'Invoice not found');
        }

        $invoice = Invoice::with(['pesanan.produk.mitra', 'pelanggan', 'mitra'])
            ->where('id_pesanan', $orderId)
            ->firstOrFail();

        // Check authorization (allow admin to bypass)
        $user = Auth::user();
        if ($user->role !== 'admin') {
            if ($user->pelanggan && $invoice->id_pelanggan != $user->pelanggan->ID_Pelanggan) {
                abort(403, 'Unauthorized');
            }
            if ($user->mitra && $invoice->id_mitra != $user->mitra->ID_Mitra) {
                abort(403, 'Unauthorized');
            }
        }

        $pdf = $this->invoiceService->generatePDF($invoice);

        return $pdf->stream('invoice-' . $invoice->invoice_number . '.pdf');
    }
}
