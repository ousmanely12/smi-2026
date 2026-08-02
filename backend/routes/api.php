<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PotController;
use App\Http\Controllers\MembreController;
use App\Http\Controllers\CotisationController;
use App\Http\Controllers\RegistreController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/request-otp', [AuthController::class, 'requestOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('pots', PotController::class);

    Route::get('/pots/{pot_id}/membres', [MembreController::class, 'index']);
    Route::post('/membres', [MembreController::class, 'store']);
    Route::get('/membres/{membre}', [MembreController::class, 'show']);
    Route::put('/membres/{membre}', [MembreController::class, 'update']);
    Route::delete('/membres/{membre}', [MembreController::class, 'destroy']);

    Route::post('/membres/{membre}/documents', [MembreController::class, 'addDocument']);
    Route::delete('/documents/{document}', [MembreController::class, 'deleteDocument']);

    Route::post('/paiements/generer-lien', [CotisationController::class, 'genererLien']);
    Route::post('/paiements/confirmer', [CotisationController::class, 'confirmerPaiement']);
    Route::post('/paiements/saisie-manuelle', [CotisationController::class, 'saisieManuelle']);
    Route::get('/pots/{pot_id}/cotisations', [CotisationController::class, 'historique']);

    Route::get('/registre', [RegistreController::class, 'index']);
    Route::get('/registre/verifier', [RegistreController::class, 'verifierIntegrite']);
    Route::get('/registre/exporter', [RegistreController::class, 'exporter']);
});