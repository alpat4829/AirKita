<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    protected $table = 'produk';
    protected $primaryKey = 'ID_Produk';
    protected $fillable = ['ID_Mitra', 'Nama_Produk', 'Harga', 'Deskripsi'];

    public function mitra()
    {
        return $this->belongsTo(Mitra::class, 'ID_Mitra', 'ID_Mitra');
    }

    public function pesanan()
    {
        return $this->hasMany(Pesanan::class, 'ID_Produk', 'ID_Produk');
    }
}
