@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="flex-1 flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-2xl space-y-6 text-center">

        <h1 class="text-4xl font-bold text-text-primary">
            Bonjour, <span class="text-primary">{{ Auth::user()->name }}</span> 👋
        </h1>
        <p class="text-text-secondary">Tu es connecté en tant que <strong>{{ Auth::user()->role }}</strong>.</p>

        @if(Auth::user()->role === 'admin')
            <a href="{{ route('admin.dashboard') }}"
               class="inline-block rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-primary-light transition-colors">
                Accès admin →
            </a>
        @endif

        <form method="POST" action="{{ route('logout') }}" class="mt-6">
            @csrf
            <button type="submit"
                class="rounded-lg border border-border px-6 py-2 text-text-secondary hover:text-text-primary hover:border-primary transition-colors">
                Se déconnecter
            </button>
        </form>

    </div>
</div>
@endsection
