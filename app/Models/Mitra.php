<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Mitra extends Model
{
    protected $table = 'mitra';
    protected $primaryKey = 'ID_Mitra';
    protected $fillable = [
        'user_id',
        'ID_KELURAHAN',
        'Nama_Mitra',
        'slug',
        'Pemilik',
        'No_HP',
        'Alamat',
        'Latitude',
        'Longitude',
        'Email',
        'Foto_Depot',
        'Deskripsi_Depot',
        'Jam_buka',
        'Jam_Tutup',
        'Status',
        'Manual_Status',
        'approval_status',
        'verified_at',
        'verified_by',
        'rejection_reason'
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Boot the model and auto-generate slug.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($mitra) {
            if (empty($mitra->slug)) {
                $slug = Str::slug($mitra->Nama_Mitra);

                // Ensure uniqueness
                $originalSlug = $slug;
                $counter = 1;
                while (static::where('slug', $slug)->where('ID_Mitra', '!=', $mitra->ID_Mitra)->exists()) {
                    $slug = $originalSlug . '-' . $counter;
                    $counter++;
                }

                $mitra->slug = $slug;
            }
        });
    }

    public function kelurahan()
    {
        return $this->belongsTo(Kelurahan::class, 'ID_KELURAHAN', 'ID_KELURAHAN');
    }

    public function produk()
    {
        return $this->hasMany(Produk::class, 'ID_Mitra', 'ID_Mitra');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Scopes for filtering by approval status
    public function scopeApproved($query)
    {
        return $query->where('approval_status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('approval_status', 'pending');
    }

    public function scopeRejected($query)
    {
        return $query->where('approval_status', 'rejected');
    }

    // Check if depot is approved
    public function isApproved()
    {
        return $this->approval_status === 'approved';
    }

    // Check if depot is pending
    public function isPending()
    {
        return $this->approval_status === 'pending';
    }

    // Check if depot is rejected
    public function isRejected()
    {
        return $this->approval_status === 'rejected';
    }
}
