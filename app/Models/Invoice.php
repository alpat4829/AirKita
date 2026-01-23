<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_number',
        'id_pesanan',
        'id_pelanggan',
        'id_mitra',
        'invoice_type',
        'total_amount',
        'tax_amount',
        'subtotal',
        'payment_method',
        'payment_date',
        'status',
        'notes'
    ];

    protected $casts = [
        'payment_date' => 'datetime',
    ];

    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class, 'id_pesanan', 'ID_Pesanan');
    }

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan', 'ID_Pelanggan');
    }

    public function mitra()
    {
        return $this->belongsTo(Mitra::class, 'id_mitra', 'ID_Mitra');
    }
}
