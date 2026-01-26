<?php

namespace App\Helpers;

use Hashids\Hashids;

class InvoiceHasher
{
    /**
     * Get Hashids instance with custom salt
     */
    private static function getHashids(): Hashids
    {
        return new Hashids(
            config('app.key') . 'invoice_salt', // Unique salt
            10, // Minimum hash length
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' // Allowed characters
        );
    }

    /**
     * Encode invoice ID to hash
     */
    public static function encode(int $id): string
    {
        return self::getHashids()->encode($id);
    }

    /**
     * Decode hash to invoice ID
     */
    public static function decode(string $hash): ?int
    {
        $decoded = self::getHashids()->decode($hash);
        return !empty($decoded) ? $decoded[0] : null;
    }
}
