<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kabupaten extends Model
{
    protected $table = 'kabupaten';
    protected $primaryKey = 'ID_Kabupaten';
    protected $fillable = ['ID_Provinsi', 'Kode_Kabupaten', 'Nama_Kab'];

    public function provinsi()
    {
        return $this->belongsTo(Provinsi::class, 'ID_Provinsi', 'ID_Provinsi');
    }

    public function kecamatan()
    {
        return $this->hasMany(Kecamatan::class, 'ID_Kabupaten', 'ID_Kabupaten');
    }
}
