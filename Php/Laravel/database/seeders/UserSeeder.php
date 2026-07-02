<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed 10 regular user accounts.
     * Credentials: user1@template.com / password (same across all projects)
     */
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            User::firstOrCreate(
                ['email' => "user{$i}@template.com"],
                [
                    'name'              => "User {$i}",
                    'email'             => "user{$i}@template.com",
                    'password'          => Hash::make('password'),
                    'role'              => 'user',
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
