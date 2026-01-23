<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Pesanan;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceService
{
    /**
     * Generate unique invoice number
     * Format: INV-YYYYMMDD-XXXX
     */
    public function generateInvoiceNumber(): string
    {
        $date = now()->format('Ymd');
        $lastInvoice = Invoice::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastInvoice ? (int) substr($lastInvoice->invoice_number, -4) + 1 : 1;
        $sequenceFormatted = str_pad($sequence, 4, '0', STR_PAD_LEFT);

        return "INV-{$date}-{$sequenceFormatted}";
    }

    /**
     * Create invoice for user (pelanggan)
     */
    public function createUserInvoice(Pesanan $pesanan): Invoice
    {
        $subtotal = $pesanan->Harga;
        $tax = 0; // No tax for now, can be configured later
        $total = $subtotal + $tax;

        return Invoice::create([
            'invoice_number' => $this->generateInvoiceNumber(),
            'id_pesanan' => $pesanan->ID_Pesanan,
            'id_pelanggan' => $pesanan->ID_Pelanggan,
            'id_mitra' => $pesanan->produk->ID_Mitra,
            'invoice_type' => 'user',
            'total_amount' => $total,
            'tax_amount' => $tax,
            'subtotal' => $subtotal,
            'payment_method' => $pesanan->Metode_Pembayaran,
            'payment_date' => $pesanan->Tanggal_Pembayaran ?? now(),
            'status' => 'paid',
            'notes' => null
        ]);
    }

    /**
     * Create invoice for mitra (partner)
     */
    public function createMitraInvoice(Pesanan $pesanan): Invoice
    {
        $subtotal = $pesanan->Harga;
        $tax = 0; // No tax for now
        $total = $subtotal + $tax;

        return Invoice::create([
            'invoice_number' => $this->generateInvoiceNumber(),
            'id_pesanan' => $pesanan->ID_Pesanan,
            'id_pelanggan' => $pesanan->ID_Pelanggan,
            'id_mitra' => $pesanan->produk->ID_Mitra,
            'invoice_type' => 'mitra',
            'total_amount' => $total,
            'tax_amount' => $tax,
            'subtotal' => $subtotal,
            'payment_method' => $pesanan->Metode_Pembayaran,
            'payment_date' => $pesanan->Tanggal_Pembayaran ?? now(),
            'status' => 'paid',
            'notes' => null
        ]);
    }

    /**
     * Generate PDF for invoice
     */
    public function generatePDF(Invoice $invoice)
    {
        $invoice->load(['pesanan.produk', 'pelanggan', 'mitra']);

        $pdf = Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice
        ]);

        return $pdf;
    }
}
