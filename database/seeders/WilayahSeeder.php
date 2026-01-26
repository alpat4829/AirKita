<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Provinsi;
use App\Models\Kabupaten;
use App\Models\Kecamatan;
use App\Models\Kelurahan;

class WilayahSeeder extends Seeder
{
    public function run()
    {
   
        $responseProvinsi = Http::get('https://wilayah.id/api/provinces.json');

        if ($responseProvinsi->successful()) {
            foreach ($responseProvinsi->json()['data'] as $itemProv) {
                
                if ($itemProv['code'] === '13') {
                    $provinsi = Provinsi::create([
                        'Kode_Provinsi' => $itemProv['code'],
                        'Nama_Provinsi' => $itemProv['name']
                    ]);

                    
                    $responseKabupaten = Http::get("https://wilayah.id/api/regencies/{$itemProv['code']}.json");

                    if ($responseKabupaten->successful()) {
                        foreach ($responseKabupaten->json()['data'] as $itemKab) {
                      
                            if ($itemKab['code'] === '13.71') {
                                $kabupaten = Kabupaten::create([
                                    'ID_Provinsi' => $provinsi->ID_Provinsi,
                                    'Kode_Kabupaten' => $itemKab['code'],
                                    'Nama_Kab' => $itemKab['name']
                                ]);

                                $responseKecamatan = Http::get("https://wilayah.id/api/districts/{$itemKab['code']}.json");

                                if ($responseKecamatan->successful()) {
                                    foreach ($responseKecamatan->json()['data'] as $itemKec) {
                                        $kecamatan = Kecamatan::create([
                                            'ID_Kabupaten' => $kabupaten->ID_Kabupaten,
                                            'Kode_Kecamatan' => $itemKec['code'],
                                            'Nama_Kec' => $itemKec['name'] 
                                        ]);

                                       
                                        $responseKelurahan = Http::get("https://wilayah.id/api/villages/{$itemKec['code']}.json");

                                        if ($responseKelurahan->successful()) {
                                            foreach ($responseKelurahan->json()['data'] as $itemKel) {
                                                Kelurahan::create([
                                                    'ID_Kecamatan' => $kecamatan->ID_Kecamatan,
                                                    'Kode_Kelurahan' => $itemKel['code'],
                                                    'Nama_Kel' => $itemKel['name'] 
                                                ]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}