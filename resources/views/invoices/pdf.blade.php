<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 11px;
            line-height: 1.5;
            color: #2d3748;
            background: white;
            padding: 0;
        }

        .invoice-container {
            max-width: 100%;
            margin: 0;
            background: white;
            padding: 30px;
        }

        /* Header with Logo and Brand */
        .header {
            display: table;
            width: 100%;
            margin-bottom: 25px;
        }

        .logo-section {
            display: table-cell;
            vertical-align: middle;
            width: 50%;
        }

        .logo-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-circle {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .logo-circle svg {
            width: 28px;
            height: 28px;
            fill: white;
        }

        .brand-info h1 {
            font-size: 22px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 2px;
            letter-spacing: -0.5px;
        }

        .brand-info p {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .invoice-title-section {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
            width: 50%;
        }

        .invoice-badge {
            display: inline-block;
            background: #fbbf24;
            padding: 8px 30px;
            border-radius: 4px;
        }

        .invoice-badge h2 {
            font-size: 32px;
            font-weight: bold;
            color: #1e293b;
            letter-spacing: 2px;
        }

        /* Yellow accent bar */
        .accent-bar {
            height: 8px;
            background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
            margin: 20px 0;
        }

        /* Info Section */
        .info-section {
            display: table;
            width: 100%;
            margin-bottom: 25px;
        }

        .info-left {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            padding-right: 20px;
        }

        .info-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            text-align: right;
        }

        .info-block h3 {
            font-size: 11px;
            font-weight: bold;
            color: #0ea5e9;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .info-block p {
            font-size: 10px;
            color: #475569;
            margin: 3px 0;
            line-height: 1.6;
        }

        .info-block strong {
            color: #1e293b;
        }

        .invoice-meta {
            background: #f8fafc;
            padding: 12px 15px;
            border-radius: 6px;
            margin-top: 10px;
        }

        .invoice-meta p {
            margin: 4px 0;
        }

        /* Items Table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .items-table thead {
            background: #334155;
        }

        .items-table th {
            padding: 12px 15px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
            color: white;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .items-table th:last-child,
        .items-table td:last-child {
            text-align: right;
        }

        .items-table tbody tr {
            border-bottom: 1px solid #e2e8f0;
        }

        .items-table tbody tr:last-child {
            border-bottom: 2px solid #cbd5e1;
        }

        .items-table td {
            padding: 12px 15px;
            font-size: 10px;
            color: #475569;
        }

        .items-table td:first-child {
            font-weight: 600;
            color: #1e293b;
        }

        /* Totals Section */
        .totals-section {
            margin-top: 20px;
            float: right;
            width: 280px;
        }

        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 15px;
            font-size: 11px;
        }

        .totals-row.subtotal {
            color: #64748b;
            border-bottom: 1px solid #e2e8f0;
        }

        .totals-row.total {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: #1e293b;
            font-weight: bold;
            font-size: 16px;
            padding: 12px 15px;
            border-radius: 6px;
            margin-top: 5px;
        }

        /* Depot Info Box */
        .depot-box {
            clear: both;
            margin-top: 30px;
            padding: 15px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-left: 4px solid #0ea5e9;
            border-radius: 6px;
        }

        .depot-box h3 {
            font-size: 12px;
            font-weight: bold;
            color: #0ea5e9;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .depot-box p {
            font-size: 10px;
            color: #475569;
            margin: 4px 0;
        }

        .depot-box strong {
            color: #1e293b;
            display: inline-block;
            min-width: 80px;
        }

        /* Footer */
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
        }

        .footer p {
            font-size: 9px;
            color: #94a3b8;
            margin: 4px 0;
        }

        .footer .thank-you {
            font-size: 11px;
            font-weight: bold;
            color: #475569;
            margin-bottom: 8px;
        }

        /* Payment Badge */
        .payment-method-badge {
            display: inline-block;
            background: #334155;
            color: white;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 0.3px;
        }

        .status-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        /* Prevent page breaks */
        .invoice-container,
        .items-table,
        .depot-box {
            page-break-inside: avoid;
        }
    </style>
</head>

<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <div class="logo-wrapper">
                    <div class="logo-circle">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                    </div>
                    <div class="brand-info">
                        <h1>AirKita</h1>
                        <p>Layanan Distribusi Air Terpercaya</p>
                    </div>
                </div>
            </div>
            <div class="invoice-title-section">
                <div class="invoice-badge">
                    <h2>INVOICE</h2>
                </div>
            </div>
        </div>

        <!-- Yellow Accent Bar -->
        <div class="accent-bar"></div>

        <!-- Info Section -->
        <div class="info-section">
            <div class="info-left">
                <div class="info-block">
                    <h3>{{ $invoice->invoice_type === 'user' ? 'Pelanggan' : 'Mitra' }}</h3>
                    @if($invoice->invoice_type === 'user')
                        <p><strong>Nama:</strong> {{ $invoice->pelanggan->Nama }}</p>
                        <p><strong>Email:</strong> {{ $invoice->pelanggan->Email }}</p>
                        <p><strong>No. HP:</strong> {{ $invoice->pelanggan->No_HP }}</p>
                        <p><strong>Alamat:</strong> {{ $invoice->pelanggan->Alamat }}</p>
                    @else
                        <p><strong>Nama Depot:</strong> {{ $invoice->mitra->Nama_Mitra }}</p>
                        <p><strong>Pemilik:</strong> {{ $invoice->mitra->Pemilik }}</p>
                        <p><strong>No. HP:</strong> {{ $invoice->mitra->No_HP }}</p>
                        <p><strong>Alamat:</strong> {{ $invoice->mitra->Alamat }}</p>
                    @endif
                </div>
            </div>

            <div class="info-right">
                <div class="info-block">
                    <h3>Detail Invoice</h3>
                    <div class="invoice-meta">
                        <p><strong>Invoice #:</strong> {{ $invoice->invoice_number }}</p>
                        <p><strong>Tanggal Pembayaran:</strong><br>{{ $invoice->payment_date->format('d F Y, H:i') }}
                        </p>
                        <p><strong>Metode Pembayaran:</strong><br>
                            <span
                                class="payment-method-badge">{{ $invoice->payment_method ?? 'Digital Payment' }}</span>
                        </p>
                        <p><strong>Status:</strong><br>
                            <span class="status-badge">{{ $invoice->status }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th>Price</th>
                    <th>Qty.</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $invoice->pesanan->produk->Nama_Produk }}</td>
                    <td>Rp {{ number_format($invoice->pesanan->produk->Harga, 0, ',', '.') }}</td>
                    <td>{{ $invoice->pesanan->Jumlah }}</td>
                    <td>Rp {{ number_format($invoice->subtotal, 0, ',', '.') }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
            <div class="totals-row subtotal">
                <span>Sub Total:</span>
                <span>Rp {{ number_format($invoice->subtotal, 0, ',', '.') }}</span>
            </div>
            <div class="totals-row total">
                <span>Total:</span>
                <span>Rp {{ number_format($invoice->total_amount, 0, ',', '.') }}</span>
            </div>
        </div>

        <!-- Depot Info -->
        <div class="depot-box">
            <h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display: inline-block;">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                Informasi Depot
            </h3>
            <p><strong>Nama Depot:</strong> {{ $invoice->pesanan->produk->mitra->Nama_Mitra }}</p>
            <p><strong>Pemilik:</strong> {{ $invoice->pesanan->produk->mitra->Pemilik }}</p>
            <p><strong>Alamat:</strong> {{ $invoice->pesanan->produk->mitra->Alamat }}</p>
            <p><strong>No. HP:</strong> {{ $invoice->pesanan->produk->mitra->No_HP }}</p>
            <p><strong>Email:</strong> {{ $invoice->pesanan->produk->mitra->Email }}</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="thank-you">Terima kasih atas kepercayaan Anda menggunakan layanan kami.</p>
            <p>Invoice ini dibuat secara otomatis oleh sistem AirKita.</p>
            <p>Dicetak pada: {{ now()->format('d F Y, H:i:s') }}</p>
        </div>
    </div>
</body>

</html>