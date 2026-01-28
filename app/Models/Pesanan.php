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

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'id_pesanan', 'ID_Pesanan');
    }

    // Helper to get the primary invoice (usually customer invoice)
    public function invoice()
    {
        return $this->hasOne(Invoice::class, 'id_pesanan', 'ID_Pesanan')->where('invoice_type', 'user');
    }

    public function mitra()
    {
        return $this->hasOneThrough(
            Mitra::class,
            Produk::class,
            'ID_Produk', // Foreign key on produk table
            'ID_Mitra',  // Foreign key on mitra table
            'ID_Produk', // Local key on pesanan table
            'ID_Mitra'   // Local key on produk table
        );
    }
}
