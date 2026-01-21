<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Mitra;
use App\Models\Pelanggan;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view (role selection).
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Display the user registration form.
     */
    public function createUser(): Response
    {
        return Inertia::render('Auth/RegisterUser');
    }

    /**
     * Display the mitra registration form.
     */
    public function createMitra(): Response
    {
        return Inertia::render('Auth/RegisterMitra');
    }

    /**
     * Handle user registration.
     */
    public function storeUser(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'no_hp' => 'required|string|max:20',
            'alamat' => 'required|string',
            'id_kelurahan' => 'required|exists:kelurahan,ID_KELURAHAN',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Create user account
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'pelanggan',
        ]);

        // Create pelanggan record
        \App\Models\Pelanggan::create([
            'user_id' => $user->id,
            'ID_KELURAHAN' => $request->id_kelurahan,
            'Nama' => $request->name,
            'No_HP' => $request->no_hp,
            'Alamat' => $request->alamat,
            'Email' => $request->email,
            'Tanggal_Daftar' => now(),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }

    /**
     * Handle mitra registration.
     */
    public function storeMitra(Request $request): RedirectResponse
    {
        $request->validate([
            'nama_mitra' => 'required|string|max:255',
            'pemilik' => 'required|string|max:255',
            'no_hp' => 'required|string|max:20',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'alamat' => 'required|string',
            'id_kelurahan' => 'required|exists:kelurahan,ID_KELURAHAN',
            'jam_buka' => 'required',
            'jam_tutup' => 'required',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Create user account
        $user = User::create([
            'name' => $request->pemilik,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'mitra',
        ]);

        // Create mitra record
        Mitra::create([
            'user_id' => $user->id,
            'ID_KELURAHAN' => $request->id_kelurahan,
            'Nama_Mitra' => $request->nama_mitra,
            'Pemilik' => $request->pemilik,
            'No_HP' => $request->no_hp,
            'Alamat' => $request->alamat,
            'Email' => $request->email,
            'Jam_buka' => $request->jam_buka,
            'Jam_Tutup' => $request->jam_tutup,
            'Status' => 'active',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }

    /**
     * Handle an incoming registration request (legacy).
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'pelanggan',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
