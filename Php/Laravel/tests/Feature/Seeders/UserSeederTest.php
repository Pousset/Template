<?php

use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('UserSeeder crée 10 utilisateurs classiques', function () {
    $this->seed(UserSeeder::class);

    expect(User::where('role', 'user')->count())->toBe(10);
});

test('UserSeeder crée les bons emails', function () {
    $this->seed(UserSeeder::class);

    foreach (range(1, 10) as $i) {
        expect(User::where('email', "user{$i}@template.com")->exists())->toBeTrue();
    }
});

test('UserSeeder crée les bons noms', function () {
    $this->seed(UserSeeder::class);

    foreach (range(1, 10) as $i) {
        expect(User::where('name', "User {$i}")->exists())->toBeTrue();
    }
});

test('UserSeeder n\'écrase pas un utilisateur existant', function () {
    User::create([
        'name'     => 'Utilisateur custom',
        'email'    => 'user1@template.com',
        'password' => bcrypt('mon_mot_de_passe'),
        'role'     => 'user',
    ]);

    $this->seed(UserSeeder::class);

    // L'utilisateur préexistant n'est pas réécrit
    $user1 = User::where('email', 'user1@template.com')->first();
    expect($user1->name)->toBe('Utilisateur custom');

    // Les autres utilisateurs sont bien créés
    expect(User::where('role', 'user')->count())->toBe(10);
});

test('UserSeeder peut être lancé deux fois sans doublon', function () {
    $this->seed(UserSeeder::class);
    $this->seed(UserSeeder::class);

    expect(User::where('role', 'user')->count())->toBe(10);
});

test('les mots de passe utilisateur sont hachés correctement', function () {
    $this->seed(UserSeeder::class);

    $user = User::where('email', 'user1@template.com')->first();
    expect(\Illuminate\Support\Facades\Hash::check('password', $user->password))->toBeTrue();
});
