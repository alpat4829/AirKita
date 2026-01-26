<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pesanan extends Model
{
    protected $table = 'pesanan';
    protected $primaryKey = 'ID_Pesanan';
    protected $fillable = [
        'ID_Pelanggan',
        'ID_Produk',
        'Tanggal_Pesan',
        'Status_Pesanan',
        'Harga',
        'Jumlah',
        'Metode_Pembayaran',
        'Status_Pembayaran',
        'Tanggal_Pembayaran',
        'snap_token'
    ];

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'ID_Pelanggan', 'ID_Pelanggan');
    }

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'ID_Produk', 'ID_Produk');
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class, 'id_pesanan', 'ID_Pesanan');
    }
}
