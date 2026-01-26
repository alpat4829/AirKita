<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Check if user has one of the allowed roles
        if (!in_array($request->user()->role, $roles)) {
            // Redirect to user's appropriate dashboard based on their role
            $userRole = $request->user()->role;

            if ($userRole === 'pelanggan') {
                return redirect()->route('pelanggan.dashboard')
                    ->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
            } elseif ($userRole === 'mitra') {
                return redirect()->route('mitra.dashboard')
                    ->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
            } elseif ($userRole === 'admin') {
                return redirect()->route('admin.dashboard')
                    ->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
            }

            // Fallback to 403 if role is unknown
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
