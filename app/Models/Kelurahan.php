<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kelurahan extends Model
{
    protected $table = 'kelurahan';
    protected $primaryKey = 'ID_KELURAHAN';
    protected $fillable = ['ID_Kecamatan', 'Kode_Kelurahan', 'Nama_Kel'];

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'ID_Kecamatan', 'ID_Kecamatan');
    }

    // Menarik data depot air di wilayah ini 
    public function mitra()
    {
        return $this->hasMany(Mitra::class, 'ID_KELURAHAN', 'ID_KELURAHAN');
    }
}
