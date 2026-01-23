<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $mitra = $user->role === 'mitra' ? $user->mitra : null;

        $isOpen = false;
        if ($mitra) {
            $now = \Carbon\Carbon::now('Asia/Jakarta');
            $jamBuka = \Carbon\Carbon::createFromFormat('H:i:s', $mitra->Jam_buka, 'Asia/Jakarta');
            $jamTutup = \Carbon\Carbon::createFromFormat('H:i:s', $mitra->Jam_Tutup, 'Asia/Jakarta');
            $currentTime = \Carbon\Carbon::createFromFormat('H:i:s', $now->format('H:i:s'), 'Asia/Jakarta');
            $isWithinHours = $currentTime->between($jamBuka, $jamTutup);
            $isOpen = $mitra->Manual_Status !== null ? (bool) $mitra->Manual_Status : $isWithinHours;
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'mitra' => $mitra,
            'isOpen' => $isOpen,
            'googleMapsApiKey' => config('services.google_maps.api_key')
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Upload depot photo for mitra
     */
    public function uploadDepotPhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'foto_depot' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $user = $request->user();
        $mitra = $user->mitra;

        if (!$mitra) {
            return Redirect::back()->with('error', 'Data mitra tidak ditemukan');
        }

        // Delete old photo if exists
        if ($mitra->Foto_Depot && \Storage::disk('public')->exists($mitra->Foto_Depot)) {
            \Storage::disk('public')->delete($mitra->Foto_Depot);
        }

        // Store new photo
        $path = $request->file('foto_depot')->store('depot-photos', 'public');

        $mitra->update(['Foto_Depot' => $path]);

        return Redirect::back()->with('success', 'Foto depot berhasil diupload');
    }

    /**
     * Update depot description for mitra
     */
    public function updateDepotDescription(Request $request): RedirectResponse
    {
        $request->validate([
            'deskripsi_depot' => 'nullable|string|max:1000'
        ]);

        $user = $request->user();
        $mitra = $user->mitra;

        if (!$mitra) {
            return Redirect::back()->with('error', 'Data mitra tidak ditemukan');
        }

        $mitra->update(['Deskripsi_Depot' => $request->deskripsi_depot]);

        return Redirect::back()->with('success', 'Deskripsi depot berhasil diupdate');
    }

    /**
     * Update depot location for mitra
     */
    public function updateDepotLocation(Request $request): RedirectResponse
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $user = $request->user();
        $mitra = $user->mitra;

        if (!$mitra) {
            return Redirect::back()->with('error', 'Data mitra tidak ditemukan');
        }

        $mitra->update([
            'Latitude' => $request->latitude,
            'Longitude' => $request->longitude,
        ]);

        return Redirect::back()->with('success', 'Lokasi depot berhasil diupdate');
    }
}
