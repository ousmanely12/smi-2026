<?php

namespace App\Http\Controllers;

use App\Models\Cotisation;
use App\Models\Membre;
use App\Models\Pot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\AuditService;

class CotisationController extends Controller
{
    public function genererLien(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'mode_paiement' => 'required|in:wave,orange_money,free_money',
            'montant' => 'required|numeric|min:1',
        ]);

        $membre = Membre::find($request->membre_id);
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        $reference = 'PAY-' . strtoupper(uniqid());
        $lienPaiement = 'https://paydunya.com/payer/' . $reference;

        $cotisation = Cotisation::create([
            'membre_id' => $request->membre_id,
            'pot_id' => $membre->pot_id,
            'montant' => $request->montant,
            'mode_paiement' => $request->mode_paiement,
            'statut' => 'en_attente',
            'reference_externe' => $reference,
            'auteur' => 'systeme',
        ]);

        AuditService::log('generation_paiement', "Génération d'un lien de paiement pour le membre {$membre->id}", 'cotisations', $cotisation->id);

        $qrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' . urlencode($lienPaiement);

        return response()->json([
            'lien_paiement' => $lienPaiement,
            'qr_code' => $qrCode,
            'reference' => $reference,
            'statut' => 'en_attente',
            'cotisation' => $cotisation,
        ]);
    }

    public function confirmerPaiement(Request $request)
    {
        $request->validate(['cotisation_id' => 'required|exists:cotisations,id']);
        $cotisation = Cotisation::find($request->cotisation_id);
        if ($cotisation->membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        $cotisation->update(['statut' => 'confirme', 'date_paiement' => now(), 'auteur' => 'systeme']);
        AuditService::log('confirmation_paiement', "Confirmation du paiement {$cotisation->id}", 'cotisations', $cotisation->id);

        return response()->json(['message' => 'Paiement confirmé', 'cotisation' => $cotisation]);
    }

    public function saisieManuelle(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'montant' => 'required|numeric|min:1',
        ]);

        $membre = Membre::find($request->membre_id);
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        $cotisation = Cotisation::create([
            'membre_id' => $request->membre_id,
            'pot_id' => $membre->pot_id,
            'montant' => $request->montant,
            'mode_paiement' => 'especes',
            'statut' => 'confirme',
            'date_paiement' => now(),
            'auteur' => 'tresorier',
        ]);

        AuditService::log('saisie_manuelle_paiement', "Saisie manuelle d'un paiement en espèces pour {$membre->id}", 'cotisations', $cotisation->id);
        return response()->json(['message' => 'Paiement en espèces enregistré', 'cotisation' => $cotisation]);
    }

    public function historique($pot_id)
    {
        $pot = Pot::find($pot_id);
        if (!$pot || $pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        $cotisations = Cotisation::where('pot_id', $pot_id)->with('membre')->orderBy('created_at', 'desc')->get();
        return response()->json($cotisations);
    }
}