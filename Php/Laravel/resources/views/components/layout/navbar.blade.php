@props(['currentRoute' => ''])

<nav class="w-full border-b border-border bg-bg-secondary">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {{-- Logo --}}
        <a href="{{ route('home') }}"
           class="text-lg font-bold tracking-tight text-text-primary hover:text-primary transition-colors no-underline">
            TEMPLATE SITE
        </a>

        {{-- Liens de navigation --}}
        <div class="flex items-center gap-6 text-sm">
            <a href="{{ route('home') }}"
               class="nav-link {{ request()->routeIs('home') ? 'active' : '' }}">
                Home
            </a>
            <a href="{{ route('laravel') }}"
               class="nav-link {{ request()->routeIs('laravel') ? 'active' : '' }}">
                Laravel
            </a>
            @auth
                <a href="{{ url('/dashboard') }}"
                   class="nav-link {{ request()->is('dashboard') ? 'active' : '' }}">
                    Dashboard
                </a>
            @endauth
            {{-- Futur : lien Admin pour les utilisateurs admin --}}
        </div>

        {{-- Auth + toggle thème --}}
        <div class="flex items-center gap-3">

            {{-- Bouton toggle thème --}}
            <button
                id="theme-toggle"
                aria-label="Basculer le thème"
                class="p-2 rounded-md border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-strong transition-colors cursor-pointer bg-transparent"
            >
                {{-- Icône soleil (mode sombre actif) --}}
                <svg id="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
                {{-- Icône lune (mode clair actif) --}}
                <svg id="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     style="display:none">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
            </button>

            {{-- Boutons d'authentification --}}
            @auth
                <div class="flex items-center gap-2">
                    {{-- Futur : Avatar component --}}
                    <span class="text-sm text-text-secondary">{{ auth()->user()->name }}</span>
                </div>
                <form method="POST" action="{{ route('logout') }}" class="m-0">
                    @csrf
                    <button type="submit" class="btn-secondary">Déconnexion</button>
                </form>
            @else
                @if (Route::has('login'))
                    <a href="{{ route('login') }}" class="btn-secondary">Connexion</a>
                @endif
                @if (Route::has('register'))
                    <a href="{{ route('register') }}" class="btn-secondary">Inscription</a>
                @endif
            @endauth
        </div>
    </div>
</nav>
