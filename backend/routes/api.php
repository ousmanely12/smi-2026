<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PotController;
use App\Http\Controllers\MembreController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes d'authentification (OTP)
Route::post('/auth/request-otp', [AuthController::class, 'requestOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    // CRUD des pots (F1)
    Route::apiResource('pots', PotController::class);

    // Routes pour les membres (F2)
    Route::get('/pots/{pot_id}/membres', [MembreController::class, 'index']);
    Route::post('/membres', [MembreController::class, 'store']);
    Route::get('/membres/{membre}', [MembreController::class, 'show']);
    Route::put('/membres/{membre}', [MembreController::class, 'update']);
    Route::delete('/membres/{membre}', [MembreController::class, 'destroy']);

    // Routes pour les documents (CNI - F3)
    Route::post('/membres/{membre}/documents', [MembreController::class, 'addDocument']);
    Route::delete('/documents/{document}', [MembreController::class, 'deleteDocument']);
});