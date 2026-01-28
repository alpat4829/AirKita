<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin already exists
        $adminExists = User::where('email', 'admin@airkita.com')->exists();

        if ($adminExists) {
            $this->command->info('Admin user already exists. Skipping...');
            return;
        }

        // Create admin user
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@airkita.com',
            'password' => Hash::make('airkita'),
            'role' => 'admin',
            'email_verified_at' => now(), // Auto-verify admin
        ]);

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@airkita.com');
        $this->command->info('Password: airkita');
    }
}
