<?php

use App\Models\User;
use Database\Seeders\AdminSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('AdminSeeder crée 3 comptes admin', function () {
    $this->seed(AdminSeeder::class);

    expect(User::where('role', 'admin')->count())->toBe(3);
});

test('AdminSeeder crée les bons emails', function () {
    $this->seed(AdminSeeder::class);

    foreach (['admin1@template.com', 'admin2@template.com', 'admin3@template.com'] as $email) {
        expect(User::where('email', $email)->exists())->toBeTrue();
    }
});

test('AdminSeeder crée les bons noms', function () {
    $this->seed(AdminSeeder::class);

    foreach (['Admin 1', 'Admin 2', 'Admin 3'] as $name) {
        expect(User::where('name', $name)->exists())->toBeTrue();
    }
});

test('AdminSeeder n\'écrase pas un admin existant', function () {
    User::create([
        'name'     => 'Admin 1 existant',
        'email'    => 'admin1@template.com',
        'password' => bcrypt('autre_mot_de_passe'),
        'role'     => 'admin',
    ]);

    $this->seed(AdminSeeder::class);

    // Le compte admin1 préexistant n'est pas réécrit
    $admin1 = User::where('email', 'admin1@template.com')->first();
    expect($admin1->name)->toBe('Admin 1 existant');

    // Les autres admins sont bien créés
    expect(User::where('role', 'admin')->count())->toBe(3);
});

test('AdminSeeder peut être lancé deux fois sans doublon', function () {
    $this->seed(AdminSeeder::class);
    $this->seed(AdminSeeder::class);

    expect(User::where('role', 'admin')->count())->toBe(3);
});

test('les mots de passe admin sont hachés correctement', function () {
    $this->seed(AdminSeeder::class);

    $admin = User::where('email', 'admin1@template.com')->first();
    expect(\Illuminate\Support\Facades\Hash::check('admin', $admin->password))->toBeTrue();
});
