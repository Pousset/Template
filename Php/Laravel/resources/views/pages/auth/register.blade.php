@extends('layouts.app')

@section('title', 'Créer un compte')

@section('content')
<div class="flex-1 flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-md space-y-8">

        <div class="text-center">
            <h1 class="text-3xl font-bold text-text-primary">Créer un compte</h1>
            <p class="mt-2 text-sm text-text-secondary">Rejoins l'espace.</p>
        </div>

        <form method="POST" action="{{ route('register') }}" class="space-y-6">
            @csrf

            {{-- Nom --}}
            <div class="space-y-1">
                <label for="name" class="block text-sm font-medium text-text-primary">
                    Nom d'affichage
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    autocomplete="name"
                    required
                    value="{{ old('name') }}"
                    class="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary @error('name') border-red-500 @enderror"
                    placeholder="John Doe"
                />
                @error('name')
                    <p class="text-xs text-red-500">{{ $message }}</p>
                @enderror
            </div>

            {{-- Nom d'utilisateur --}}
            <div class="space-y-1">
                <label for="username" class="block text-sm font-medium text-text-primary">
                    Nom d'utilisateur <span class="text-text-muted">(3-50 caractères, lettres, chiffres, _ ou -)</span>
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    autocomplete="username"
                    required
                    value="{{ old('username') }}"
                    class="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary @error('username') border-red-500 @enderror"
                    placeholder="johndoe"
                />
                @error('username')
                    <p class="text-xs text-red-500">{{ $message }}</p>
                @enderror
            </div>

            {{-- Email --}}
            <div class="space-y-1">
                <label for="email" class="block text-sm font-medium text-text-primary">
                    Adresse e-mail
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    value="{{ old('email') }}"
                    class="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary @error('email') border-red-500 @enderror"
                    placeholder="toi@exemple.com"
                />
                @error('email')
                    <p class="text-xs text-red-500">{{ $message }}</p>
                @enderror
            </div>

            {{-- Mot de passe --}}
            <div class="space-y-1">
                <label for="password" class="block text-sm font-medium text-text-primary">
                    Mot de passe <span class="text-text-muted">(8 caractères min.)</span>
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="new-password"
                    required
                    minlength="8"
                    class="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary @error('password') border-red-500 @enderror"
                    placeholder="••••••••"
                />
                @error('password')
                    <p class="text-xs text-red-500">{{ $message }}</p>
                @enderror
            </div>

            {{-- Confirmation --}}
            <div class="space-y-1">
                <label for="password_confirmation" class="block text-sm font-medium text-text-primary">
                    Confirmer le mot de passe
                </label>
                <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    autocomplete="new-password"
                    required
                    class="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                />
            </div>

            <button type="submit"
                class="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Créer mon compte
            </button>
        </form>

        <p class="text-center text-sm text-text-secondary">
            Déjà un compte ?
            <a href="{{ route('login') }}" class="text-primary hover:underline">Se connecter</a>
        </p>

    </div>
</div>
@endsection
