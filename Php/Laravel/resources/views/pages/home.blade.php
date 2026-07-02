@extends('layouts.app')

@section('content')
<div class="relative h-full flex flex-col items-center justify-center overflow-hidden px-6">

    {{-- Fond ambiant (gradient radial) --}}
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
             style="background: radial-gradient(circle, #6366f1 0%, transparent 70%);">
        </div>
        <div class="absolute left-1/4 top-1/4 w-[300px] h-[300px] rounded-full opacity-10"
             style="background: radial-gradient(circle, #818cf8 0%, transparent 70%);">
        </div>
    </div>

    {{-- Contenu principal --}}
    <div class="text-center max-w-2xl mx-auto space-y-6">

        {{-- Titre --}}
        <div class="space-y-3">
            <h1 class="text-5xl sm:text-7xl font-bold tracking-tight text-text-primary leading-none">
                Template<br />
                <span class="text-primary">Site</span>
            </h1>
            <p class="text-lg text-text-secondary max-w-md mx-auto leading-relaxed">
                Un espace personnel pour présenter mes projets, mon parcours et mes compétences.
            </p>
        </div>

        {{-- Boutons CTA --}}
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            @auth
                <x-ui.button variant="primary" href="{{ url('/dashboard') }}">
                    Accéder au Dashboard &rarr;
                </x-ui.button>
            @else
                @if (Route::has('register'))
                    <x-ui.button variant="secondary" href="{{ route('register') }}">
                        Créer un compte
                    </x-ui.button>
                @endif
                @if (Route::has('login'))
                    <x-ui.button variant="secondary" href="{{ route('login') }}">
                        Se connecter
                    </x-ui.button>
                @endif
            @endauth
        </div>

        {{-- Stats --}}
        <div class="flex items-center justify-center gap-8 pt-4 border-t border-border">
            @foreach ([['label' => 'Projets', 'value' => '12+'], ['label' => "Années d'exp.", 'value' => '3+'], ['label' => 'Technologies', 'value' => '20+']] as $stat)
                <div class="text-center">
                    <p class="text-2xl font-bold text-text-primary">{{ $stat['value'] }}</p>
                    <p class="text-xs text-text-muted mt-0.5">{{ $stat['label'] }}</p>
                </div>
            @endforeach
        </div>

    </div>
</div>
@endsection
