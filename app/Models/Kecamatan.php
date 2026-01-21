<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    protected $table = 'kecamatan';
    protected $primaryKey = 'ID_Kecamatan';
    protected $fillable = ['ID_Kabupaten', 'Kode_Kecamatan', 'Nama_Kec'];

    public function kabupaten()
    {
        return $this->belongsTo(Kabupaten::class, 'ID_Kabupaten', 'ID_Kabupaten');
    }

    public function kelurahan()
    {
        return $this->hasMany(Kelurahan::class, 'ID_Kecamatan', 'ID_Kecamatan');
    }
}
