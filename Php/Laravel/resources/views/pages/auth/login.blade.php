@extends('layouts.app')

@section('title', 'Connexion')

@section('content')
<div class="flex-1 flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-md space-y-8">

        <div class="text-center">
            <h1 class="text-3xl font-bold text-text-primary">Connexion</h1>
            <p class="mt-2 text-sm text-text-secondary">Content de te revoir.</p>
        </div>

        <form method="POST" action="{{ route('login') }}" class="space-y-6">
            @csrf

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
                    Mot de passe
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    required
                    class="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                />
            </div>

            {{-- Se souvenir de moi --}}
            <div class="flex items-center gap-2">
                <input id="remember" name="remember" type="checkbox"
                    class="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                <label for="remember" class="text-sm text-text-secondary">Se souvenir de moi</label>
            </div>

            <button type="submit"
                class="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Se connecter
            </button>
        </form>

        <p class="text-center text-sm text-text-secondary">
            Pas encore de compte ?
            <a href="{{ route('register') }}" class="text-primary hover:underline">S'inscrire</a>
        </p>

    </div>
</div>
@endsection
