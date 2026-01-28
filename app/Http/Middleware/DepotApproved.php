<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Mitra;

class DepotApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Only check for mitra users
        if ($user && $user->role === 'mitra') {
            $mitra = Mitra::where('user_id', $user->id)->first();

            if (!$mitra) {
                return redirect()->route('mitra.dashboard')
                    ->with('error', 'Depot tidak ditemukan.');
            }

            // If depot is not approved, redirect to dashboard
            if (!$mitra->isApproved()) {
                return redirect()->route('mitra.dashboard')
                    ->with('warning', 'Depot Anda belum disetujui oleh admin.');
            }
        }

        return $next($request);
    }
}
