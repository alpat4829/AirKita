<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mitra extends Model
{
    protected $table = 'mitra';
    protected $primaryKey = 'ID_Mitra';
    protected $fillable = [
        'user_id',
        'ID_KELURAHAN',
        'Nama_Mitra',
        'Pemilik',
        'No_HP',
        'Alamat',
        'Latitude',
        'Longitude',
        'Email',
        'Foto_Depot',
        'Deskripsi_Depot',
        'Jam_buka',
        'Jam_Tutup',
        'Status',
        'Manual_Status'
    ];

    public function kelurahan()
    {
        return $this->belongsTo(Kelurahan::class, 'ID_KELURAHAN', 'ID_KELURAHAN');
    }

    public function produk()
    {
        return $this->hasMany(Produk::class, 'ID_Mitra', 'ID_Mitra');
    }
}
