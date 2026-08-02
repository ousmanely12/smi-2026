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
        $this->authorizeMembre($membre);

        $pot = $membre->pot;
        if ($pot->tresorier_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $reference = 'PAY-' . strtoupper(uniqid());
        $lienPaiement = 'https://paydunya.com/payer/' . $reference;

        $cotisation = Cotisation::create([
            'membre_id' => $request->membre_id,
            'pot_id' => $pot->id,
            'montant' => $request->montant,
            'mode_paiement' => $request->mode_paiement,
            'statut' => 'en_attente',
            'reference_externe' => $reference,
            'auteur' => 'systeme',
        ]);

        AuditService::log(
            'generation_paiement',
            "Génération d'un lien de paiement pour le membre ID {$cotisation->membre_id} (mode: {$cotisation->mode_paiement})",
            'cotisations',
            $cotisation->id
        );

        $qrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' . urlencode($lienPaiement);

        return response()->json([
            'message' => 'Lien de paiement généré',
            'lien_paiement' => $lienPaiement,
            'qr_code' => $qrCode,
            'reference' => $reference,
            'statut' => 'en_attente',
            'cotisation' => $cotisation,
        ]);
    }

    public function confirmerPaiement(Request $request)
    {
        $request->validate([
            'cotisation_id' => 'required|exists:cotisations,id',
        ]);

        $cotisation = Cotisation::find($request->cotisation_id);
        $membre = $cotisation->membre;
        $this->authorizeMembre($membre);

        if ($cotisation->statut !== 'en_attente') {
            return response()->json(['message' => 'Cette cotisation est déjà confirmée'], 400);
        }

        $cotisation->update([
            'statut' => 'confirme',
            'date_paiement' => now(),
            'auteur' => 'systeme',
        ]);

        AuditService::log(
            'confirmation_paiement',
            "Confirmation du paiement ID {$cotisation->id} pour le membre ID {$membre->id}",
            'cotisations',
            $cotisation->id
        );

        return response()->json([
            'message' => 'Paiement confirmé',
            'cotisation' => $cotisation,
        ]);
    }

    public function saisieManuelle(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'montant' => 'required|numeric|min:1',
        ]);

        $membre = Membre::find($request->membre_id);
        $this->authorizeMembre($membre);

        $pot = $membre->pot;
        if ($pot->tresorier_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $cotisation = Cotisation::create([
            'membre_id' => $request->membre_id,
            'pot_id' => $pot->id,
            'montant' => $request->montant,
            'mode_paiement' => 'especes',
            'statut' => 'confirme',
            'date_paiement' => now(),
            'auteur' => 'tresorier',
        ]);

        AuditService::log(
            'saisie_manuelle_paiement',
            "Saisie manuelle d'un paiement en espèces pour le membre ID {$membre->id} (montant: {$cotisation->montant} FCFA)",
            'cotisations',
            $cotisation->id
        );

        return response()->json([
            'message' => 'Paiement en espèces enregistré',
            'cotisation' => $cotisation,
        ]);
    }

    public function historique($pot_id)
    {
        $pot = Pot::find($pot_id);
        if (!$pot || $pot->tresorier_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $cotisations = Cotisation::where('pot_id', $pot_id)
            ->with('membre')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($cotisations);
    }

    private function authorizeMembre($membre)
    {
        if ($membre->pot->tresorier_id !== Auth::id()) {
            abort(403, 'Non autorisé');
        }
    }
}