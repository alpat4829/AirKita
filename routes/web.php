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
    Route::post('/profile/upload-depot-photo', [ProfileController::class, 'uploadDepotPhoto'])->name('profile.uploadDepotPhoto');
    Route::post('/profile/update-depot-description', [ProfileController::class, 'updateDepotDescription'])->name('profile.updateDepotDescription');
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
    Route::post('/dashboard/pelanggan/order/{id}/cancel', [PelangganOrderController::class, 'cancel'])->name('pelanggan.order.cancel');
    Route::post('/dashboard/pelanggan/order/{id}/continue-payment', [PelangganOrderController::class, 'continuePayment'])->name('pelanggan.order.continue');
});

// Mitra Routes
use App\Http\Controllers\MitraDashboardController;
use App\Http\Controllers\MitraProductController;
use App\Http\Controllers\MitraOrderController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/mitra', [MitraDashboardController::class, 'index'])->name('mitra.dashboard');

    // Depot Controls
    Route::post('/dashboard/mitra/toggle-status', [MitraDashboardController::class, 'toggleStatus'])->name('mitra.toggle.status');
    Route::post('/dashboard/mitra/reset-status', [MitraDashboardController::class, 'resetStatus'])->name('mitra.reset.status');
    Route::post('/dashboard/mitra/update-hours', [MitraDashboardController::class, 'updateHours'])->name('mitra.update.hours');

    // Product Management
    Route::get('/dashboard/mitra/products', [MitraProductController::class, 'index'])->name('mitra.products');
    Route::post('/dashboard/mitra/products', [MitraProductController::class, 'store'])->name('mitra.products.store');
    Route::put('/dashboard/mitra/products/{id}', [MitraProductController::class, 'update'])->name('mitra.products.update');
    Route::delete('/dashboard/mitra/products/{id}', [MitraProductController::class, 'destroy'])->name('mitra.products.destroy');

    // Order Management
    Route::get('/dashboard/mitra/orders', [MitraOrderController::class, 'history'])->name('mitra.orders');
    Route::post('/dashboard/mitra/order/{id}/accept', [MitraOrderController::class, 'accept'])->name('mitra.order.accept');
    Route::post('/dashboard/mitra/order/{id}/reject', [MitraOrderController::class, 'reject'])->name('mitra.order.reject');
});

require __DIR__ . '/auth.php';
