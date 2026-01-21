<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = Auth::user();

    // Redirect based on user role
    if ($user->role === 'pelanggan') {
        return redirect()->route('pelanggan.dashboard');
    } elseif ($user->role === 'mitra') {
        return redirect()->route('mitra.dashboard');
    } elseif ($user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    // Default fallback
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Pelanggan Routes
use App\Http\Controllers\PelangganDashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PelangganOrderController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/pelanggan', [PelangganDashboardController::class, 'index'])->name('pelanggan.dashboard');
    Route::get('/dashboard/pelanggan/depot/{id}', [PelangganDashboardController::class, 'show'])->name('pelanggan.depot.show');
    Route::get('/dashboard/pelanggan/orders', [PelangganOrderController::class, 'index'])->name('pelanggan.orders');
    Route::post('/dashboard/pelanggan/order', [OrderController::class, 'store'])->name('pelanggan.order.store');
    Route::post('/dashboard/pelanggan/reorder/{id}', [OrderController::class, 'reorder'])->name('pelanggan.order.reorder');
});

require __DIR__ . '/auth.php';
