<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentCallbackController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    /**
     * Handle Midtrans payment notification/callback (from Midtrans webhook)
     */
    public function handle(Request $request)
    {
        try {
            // Set Midtrans configuration
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production', false);

            // Get notification from Midtrans
            $notification = new \Midtrans\Notification();

            $transactionStatus = $notification->transaction_status;
            $fraudStatus = $notification->fraud_status;
            $orderId = $notification->order_id;

            // Extract pesanan ID from order_id (format: ORDER-{ID}-{timestamp})
            $orderIdParts = explode('-', $orderId);
            $pesananId = $orderIdParts[1] ?? null;

            if (!$pesananId) {
                Log::error('Invalid order ID format: ' . $orderId);
                return response()->json(['status' => 'error', 'message' => 'Invalid order ID'], 400);
            }

            $pesanan = Pesanan::with('produk')->find($pesananId);

            if (!$pesanan) {
                Log::error('Pesanan not found: ' . $pesananId);
                return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
            }

            Log::info('Payment notification received', [
                'order_id' => $orderId,
                'transaction_status' => $transactionStatus,
                'fraud_status' => $fraudStatus
            ]);

            // Handle different transaction statuses
            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'accept') {
                    $paymentMethod = $this->extractPaymentMethod($notification);
                    $this->handleSuccessfulPayment($pesanan, $paymentMethod);
                }
            } elseif ($transactionStatus == 'settlement') {
                $paymentMethod = $this->extractPaymentMethod($notification);
                $this->handleSuccessfulPayment($pesanan, $paymentMethod);
            } elseif ($transactionStatus == 'pending') {
                $pesanan->update([
                    'Status_Pembayaran' => 'Pending',
                    'Status_Pesanan' => 'Menunggu Pembayaran'
                ]);
            } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
                $pesanan->update([
                    'Status_Pembayaran' => 'Failed',
                    'Status_Pesanan' => 'Dibatalkan'
                ]);
            }

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            Log::error('Payment callback error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle payment success from frontend (for development without webhook)
     */
    public function handleFrontendSuccess(Request $request)
    {
        try {
            $orderId = $request->order_id;

            // Extract pesanan ID from order_id (format: ORDER-{ID}-{timestamp})
            $orderIdParts = explode('-', $orderId);
            $pesananId = $orderIdParts[1] ?? null;

            if (!$pesananId) {
                return response()->json(['status' => 'error', 'message' => 'Invalid order ID'], 400);
            }

            $pesanan = Pesanan::with('produk')->find($pesananId);

            if (!$pesanan) {
                return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
            }

            // Verify payment status with Midtrans
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production', false);

            $status = \Midtrans\Transaction::status($orderId);

            Log::info('Frontend payment verification', [
                'order_id' => $orderId,
                'transaction_status' => $status->transaction_status,
                'fraud_status' => $status->fraud_status ?? 'N/A'
            ]);

            // Only update if payment is actually successful
            if (in_array($status->transaction_status, ['capture', 'settlement'])) {
                // Extract payment method details safely
                $paymentType = $status->payment_type ?? 'Digital Payment';
                $bank = null;

                // Check for VA numbers (bank transfer)
                if (property_exists($status, 'va_numbers') && is_array($status->va_numbers) && count($status->va_numbers) > 0) {
                    $bank = $status->va_numbers[0]->bank ?? null;
                }

                // Check for Permata VA
                if (!$bank && property_exists($status, 'permata_va_number') && !empty($status->permata_va_number)) {
                    $bank = 'Permata';
                }

                // If no bank found, check payment type
                if (!$bank && isset($status->payment_type)) {
                    $bank = match ($status->payment_type) {
                        'credit_card' => 'Credit Card',
                        'gopay' => 'GoPay',
                        'shopeepay' => 'ShopeePay',
                        'qris' => 'QRIS',
                        'cstore' => 'Convenience Store',
                        default => ucfirst(str_replace('_', ' ', $status->payment_type))
                    };
                }

                $paymentMethod = $bank ? strtoupper($bank) : 'Digital Payment';

                Log::info('Payment method extracted', [
                    'order_id' => $pesanan->ID_Pesanan,
                    'payment_method' => $paymentMethod,
                    'payment_type' => $paymentType
                ]);

                $this->handleSuccessfulPayment($pesanan, $paymentMethod);
                return response()->json(['status' => 'success', 'message' => 'Payment verified and updated']);
            }

            return response()->json(['status' => 'pending', 'message' => 'Payment not yet completed']);

        } catch (\Exception $e) {
            Log::error('Frontend payment verification error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle successful payment
     */
    private function handleSuccessfulPayment(Pesanan $pesanan, $paymentMethod = null)
    {
        // Update pesanan status
        $updateData = [
            'Status_Pembayaran' => 'Paid',
            'Status_Pesanan' => 'Diproses',
            'Tanggal_Pembayaran' => now()
        ];

        // Add payment method if provided
        if ($paymentMethod) {
            $updateData['Metode_Pembayaran'] = $paymentMethod;
        }

        $pesanan->update($updateData);

        // Generate invoices for both user and mitra
        try {
            // Create invoice for user (pelanggan)
            $this->invoiceService->createUserInvoice($pesanan);

            // Create invoice for mitra
            $this->invoiceService->createMitraInvoice($pesanan);

            Log::info('Invoices created successfully for order: ' . $pesanan->ID_Pesanan);
        } catch (\Exception $e) {
            Log::error('Error creating invoices: ' . $e->getMessage());
        }
    }

    /**
     * Extract payment method from Midtrans notification
     */
    private function extractPaymentMethod($notification)
    {
        $paymentType = $notification['payment_type'] ?? 'Digital Payment';
        $bank = null;

        // Check for VA numbers (bank transfer)
        if (isset($notification['va_numbers']) && is_array($notification['va_numbers']) && count($notification['va_numbers']) > 0) {
            $bank = $notification['va_numbers'][0]['bank'] ?? null;
        }

        // Check for Permata VA
        if (!$bank && isset($notification['permata_va_number']) && !empty($notification['permata_va_number'])) {
            $bank = 'Permata';
        }

        // If no bank found, check payment type
        if (!$bank && isset($notification['payment_type'])) {
            $bank = match ($notification['payment_type']) {
                'credit_card' => 'Credit Card',
                'gopay' => 'GoPay',
                'shopeepay' => 'ShopeePay',
                'qris' => 'QRIS',
                'cstore' => 'Convenience Store',
                default => ucfirst(str_replace('_', ' ', $notification['payment_type']))
            };
        }

        return $bank ? strtoupper($bank) : 'Digital Payment';
    }
}
