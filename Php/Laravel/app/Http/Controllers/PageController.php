<?php

namespace App\Http\Controllers;

class PageController extends Controller
{
    /**
     * Page d'accueil (hero).
     */
    public function home(): \Illuminate\View\View
    {
        return view('pages.home');
    }

    /**
     * Page de bienvenue Laravel originale.
     */
    public function laravel(): \Illuminate\View\View
    {
        return view('pages.laravel');
    }
}
