<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provinsi extends Model
{
    protected $table = 'provinsi';
    protected $primaryKey = 'ID_Provinsi';
    protected $fillable = ['Kode_Provinsi', 'Nama_Provinsi'];

    public function kabupaten()
    {
        return $this->hasMany(Kabupaten::class, 'ID_Provinsi', 'ID_Provinsi');
    }
}
