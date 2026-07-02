<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', config('app.name', 'Laravel'))</title>

    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @endif
</head>
<body class="h-screen flex flex-col overflow-hidden bg-bg-primary text-text-primary">

    <x-layout.navbar />

    <main class="flex-1 overflow-y-auto">
        @yield('content')
    </main>

    <x-layout.footer />

    {{-- Script de gestion du thÃ¨me dark/light --}}
    <script>
        (function () {
            const html     = document.documentElement;
            const toggle   = document.getElementById('theme-toggle');
            const iconSun  = document.getElementById('icon-sun');
            const iconMoon = document.getElementById('icon-moon');

            function applyTheme(isDark) {
                if (isDark) {
                    html.classList.add('dark');
                    iconSun.style.display  = 'block';
                    iconMoon.style.display = 'none';
                } else {
                    html.classList.remove('dark');
                    iconSun.style.display  = 'none';
                    iconMoon.style.display = 'block';
                }
            }

            const saved = localStorage.getItem('theme') ?? 'dark';
            applyTheme(saved === 'dark');

            toggle.addEventListener('click', function () {
                const isDark = !html.classList.contains('dark');
                applyTheme(isDark);
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        })();
    </script>
</body>
</html>
