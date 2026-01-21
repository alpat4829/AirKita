<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pelanggan extends Model
{
    protected $table = 'pelanggan';
    protected $primaryKey = 'ID_Pelanggan';
    protected $fillable = ['user_id', 'ID_KELURAHAN', 'Nama', 'No_HP', 'Alamat', 'Email', 'Tanggal_Daftar'];

    public function kelurahan()
    {
        return $this->belongsTo(Kelurahan::class, 'ID_KELURAHAN', 'ID_KELURAHAN');
    }

    public function pesanan()
    {
        return $this->hasMany(Pesanan::class, 'ID_Pelanggan', 'ID_Pelanggan');
    }
}
