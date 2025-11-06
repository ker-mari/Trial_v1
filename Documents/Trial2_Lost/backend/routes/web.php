<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\ItemController;

// Fallback route for SPA
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');