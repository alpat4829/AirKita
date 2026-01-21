<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LocationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Location API endpoints
Route::get('/provinsi', [LocationController::class, 'getProvinsi']);
Route::get('/kabupaten/{provinsiId}', [LocationController::class, 'getKabupaten']);
Route::get('/kecamatan/{kabupatenId}', [LocationController::class, 'getKecamatan']);
Route::get('/kelurahan/{kecamatanId}', [LocationController::class, 'getKelurahan']);
