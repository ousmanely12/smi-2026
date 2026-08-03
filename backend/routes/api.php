<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PotController;
use App\Http\Controllers\MembreController;
use App\Http\Controllers\CotisationController;
use App\Http\Controllers\RegistreController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PdfController;
use Illuminate\Support\Facades\Route;

// Authentification OTP
Route::post('/auth/request-otp', [AuthController::class, 'requestOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // F1 – Pots
    Route::apiResource('pots', PotController::class);

    // F2 – Membres
    Route::get('/pots/{pot_id}/membres', [MembreController::class, 'index']);
    Route::post('/membres', [MembreController::class, 'store']);
    Route::get('/membres/{membre}', [MembreController::class, 'show']);
    Route::put('/membres/{membre}', [MembreController::class, 'update']);
    Route::delete('/membres/{membre}', [MembreController::class, 'destroy']);

    // F3 – Documents (CNI)
    Route::post('/membres/{membre}/documents', [MembreController::class, 'addDocument']);
    Route::delete('/documents/{document}', [MembreController::class, 'deleteDocument']);

    // F4 – Paiements
    Route::post('/paiements/generer-lien', [CotisationController::class, 'genererLien']);
    Route::post('/paiements/confirmer', [CotisationController::class, 'confirmerPaiement']);
    Route::post('/paiements/saisie-manuelle', [CotisationController::class, 'saisieManuelle']);
    Route::get('/pots/{pot_id}/cotisations', [CotisationController::class, 'historique']);

    // F5 – Registre
    Route::get('/registre', [RegistreController::class, 'index']);
    Route::get('/registre/verifier', [RegistreController::class, 'verifierIntegrite']);
    Route::get('/registre/exporter', [RegistreController::class, 'exporter']);

    // F6 – Notifications
    Route::post('/notifications/rappel', [NotificationController::class, 'rappelCotisation']);
    Route::post('/notifications/recu', [NotificationController::class, 'envoyerRecu']);
    Route::post('/notifications/escalade', [NotificationController::class, 'escaladeAppel']);

    // F7 – PDF
    Route::post('/pdf/recu', [PdfController::class, 'telechargerRecu']);
    Route::post('/pdf/attestation', [PdfController::class, 'telechargerAttestation']);
    Route::post('/pdf/recu/apercu', [PdfController::class, 'apercuRecu']);
});