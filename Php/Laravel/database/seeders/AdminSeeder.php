<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed 3 admin accounts.
     * Credentials: admin1@template.com / admin (same across all projects)
     */
    public function run(): void
    {
        $admins = [
            [
                'name'              => 'Admin 1',
                'username'          => 'admin1',
                'email'             => 'admin1@template.com',
                'password'          => Hash::make('admin'),
                'role'              => 'admin',
                'email_verified_at' => now(),
            ],
            [
                'name'              => 'Admin 2',
                'username'          => 'admin2',
                'email'             => 'admin2@template.com',
                'password'          => Hash::make('admin'),
                'role'              => 'admin',
                'email_verified_at' => now(),
            ],
            [
                'name'              => 'Admin 3',
                'username'          => 'admin3',
                'email'             => 'admin3@template.com',
                'password'          => Hash::make('admin'),
                'role'              => 'admin',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($admins as $admin) {
            User::firstOrCreate(
                ['email' => $admin['email']],
                $admin
            );
        }
    }
}
