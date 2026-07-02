@extends('layouts.app')

@section('title', 'Admin — Dashboard')

@section('content')
<div class="flex-1 flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-3xl space-y-6 text-center">

        <h1 class="text-4xl font-bold text-text-primary">
            Panel <span class="text-primary">Admin</span>
        </h1>
        <p class="text-text-secondary">Connecté en tant que <strong>{{ Auth::user()->name }}</strong>.</p>

        <a href="{{ route('dashboard') }}"
           class="inline-block rounded-lg border border-border px-6 py-2 text-text-secondary hover:text-text-primary hover:border-primary transition-colors">
            ← Tableau de bord
        </a>

        <form method="POST" action="{{ route('logout') }}" class="mt-4">
            @csrf
            <button type="submit"
                class="rounded-lg border border-border px-6 py-2 text-text-secondary hover:text-text-primary hover:border-red-500 transition-colors">
                Se déconnecter
            </button>
        </form>

    </div>
</div>
@endsection
