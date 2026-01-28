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
    Route::post('/profile/update-depot-location', [ProfileController::class, 'updateDepotLocation'])->name('profile.updateDepotLocation');
});

// Pelanggan Routes
use App\Http\Controllers\PelangganDashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PelangganOrderController;

Route::middleware(['auth', 'verified', 'role:pelanggan'])->group(function () {
    Route::get('/dashboard/pelanggan', [PelangganDashboardController::class, 'index'])->name('pelanggan.dashboard');
    Route::get('/dashboard/pelanggan/depot/{mitra}', [PelangganDashboardController::class, 'show'])->name('pelanggan.depot.show');
    Route::get('/dashboard/pelanggan/orders', [PelangganOrderController::class, 'index'])->name('pelanggan.orders');
    Route::post('/dashboard/pelanggan/order', [OrderController::class, 'store'])->name('pelanggan.order.store');
    Route::post('/dashboard/pelanggan/reorder/{id}', [OrderController::class, 'reorder'])->name('pelanggan.order.reorder');
    Route::post('/dashboard/pelanggan/order/{id}/cancel', [PelangganOrderController::class, 'cancel'])->name('pelanggan.order.cancel');
    Route::post('/dashboard/pelanggan/order/{id}/continue-payment', [PelangganOrderController::class, 'continuePayment'])->name('pelanggan.order.continue');

    // Invoice routes for pelanggan
    Route::get('/dashboard/pelanggan/invoices', [\App\Http\Controllers\InvoiceController::class, 'pelangganIndex'])->name('pelanggan.invoices');
    Route::get('/dashboard/pelanggan/invoices/{id}', [\App\Http\Controllers\InvoiceController::class, 'show'])->name('pelanggan.invoices.show');
    Route::get('/dashboard/pelanggan/invoices/{id}/download', [\App\Http\Controllers\InvoiceController::class, 'download'])->name('pelanggan.invoices.download');
    Route::get('/dashboard/pelanggan/invoices/{id}/view', [\App\Http\Controllers\InvoiceController::class, 'view'])->name('pelanggan.invoices.view');
});

// Mitra Routes
use App\Http\Controllers\MitraDashboardController;
use App\Http\Controllers\MitraProductController;
use App\Http\Controllers\MitraOrderController;

Route::middleware(['auth', 'verified', 'role:mitra'])->group(function () {
    Route::get('/dashboard/mitra', [MitraDashboardController::class, 'index'])->name('mitra.dashboard');

    // Routes that require depot approval
    Route::middleware(['depot.approved'])->group(function () {
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
        Route::post('/dashboard/mitra/order/{id}/complete', [MitraOrderController::class, 'complete'])->name('mitra.order.complete');

        // Invoice routes for mitra
        Route::get('/dashboard/mitra/invoices', [\App\Http\Controllers\InvoiceController::class, 'mitraIndex'])->name('mitra.invoices');
        Route::get('/dashboard/mitra/invoices/{id}', [\App\Http\Controllers\InvoiceController::class, 'show'])->name('mitra.invoices.show');
        Route::get('/dashboard/mitra/invoices/{id}/download', [\App\Http\Controllers\InvoiceController::class, 'download'])->name('mitra.invoices.download');
        Route::get('/dashboard/mitra/invoices/{id}/view', [\App\Http\Controllers\InvoiceController::class, 'view'])->name('mitra.invoices.view');
    });
});

// Admin Routes
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminDepotController;
use App\Http\Controllers\AdminOrderController;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Depot Approval Management
    Route::get('/depots', [AdminDepotController::class, 'index'])->name('depots.index');
    Route::get('/depots/{id}', [AdminDepotController::class, 'show'])->name('depots.show');
    Route::post('/depots/{id}/approve', [AdminDepotController::class, 'approve'])->name('depots.approve');
    Route::post('/depots/{id}/reject', [AdminDepotController::class, 'reject'])->name('depots.reject');

    // Order Monitoring
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [AdminOrderController::class, 'show'])->name('orders.show');

    // Invoice viewing
    Route::get('/invoices/{id}/view', [\App\Http\Controllers\InvoiceController::class, 'view'])->name('invoices.view');
});

// Payment callback route (no auth middleware for Midtrans webhook)
Route::post('/payment/callback', [\App\Http\Controllers\PaymentCallbackController::class, 'handle'])->name('payment.callback');

// Payment success verification from frontend (with auth)
Route::post('/payment/verify-success', [\App\Http\Controllers\PaymentCallbackController::class, 'handleFrontendSuccess'])->middleware('auth')->name('payment.verify');

require __DIR__ . '/auth.php';
