@props([
    'variant' => 'secondary', {{-- 'primary' | 'secondary' --}}
    'href'    => null,
    'type'    => 'button',
    'size'    => 'md', {{-- 'sm' | 'md' --}}
])

@php
    $classes = match($variant) {
        'primary'   => 'btn-primary',
        'secondary' => 'btn-secondary',
        default     => 'btn-secondary',
    };

    if ($size === 'sm') {
        $classes .= ' !py-1.5 !px-3 !text-xs';
    }
@endphp

@if ($href)
    <a href="{{ $href }}" {{ $attributes->merge(['class' => $classes]) }}>
        {{ $slot }}
    </a>
@else
    <button type="{{ $type }}" {{ $attributes->merge(['class' => $classes]) }}>
        {{ $slot }}
    </button>
@endif
