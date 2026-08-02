<?php

namespace App\Http\Controllers;

use App\Models\Cotisation;
use App\Models\Membre;
use App\Models\Pot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CotisationController extends Controller
{
    // Générer un lien de paiement (simulation)
    public function genererLien(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'mode_paiement' => 'required|in:wave,orange_money,free_money',
            'montant' => 'required|numeric|min:1',
        ]);

        $membre = Membre::find($request->membre_id);
        $this->authorizeMembre($membre);

        // Vérifier que le membre appartient au trésorier
        $pot = $membre->pot;
        if ($pot->tresorier_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Générer une référence unique
        $reference = 'PAY-' . strtoupper(uniqid());

        // Simuler un lien de paiement (mock)
        $lienPaiement = 'https://paydunya.com/payer/' . $reference;

        // Créer la cotisation avec statut "en_attente"
        $cotisation = Cotisation::create([
            'membre_id' => $request->membre_id,
            'pot_id' => $pot->id,
            'montant' => $request->montant,
            'mode_paiement' => $request->mode_paiement,
            'statut' => 'en_attente',
            'reference_externe' => $reference,
            'auteur' => 'systeme',
        ]);

        // Simuler la génération d'un QR code (mock)
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

    // Simuler la confirmation d'un paiement
    public function confirmerPaiement(Request $request)
    {
        $request->validate([
            'cotisation_id' => 'required|exists:cotisations,id',
        ]);

        $cotisation = Cotisation::find($request->cotisation_id);
        $membre = $cotisation->membre;
        $this->authorizeMembre($membre);

        // Vérifier que la cotisation est en attente
        if ($cotisation->statut !== 'en_attente') {
            return response()->json(['message' => 'Cette cotisation est déjà confirmée'], 400);
        }

        // Confirmer la cotisation
        $cotisation->update([
            'statut' => 'confirme',
            'date_paiement' => now(),
            'auteur' => 'systeme',
        ]);

        return response()->json([
            'message' => 'Paiement confirmé',
            'cotisation' => $cotisation,
        ]);
    }

    // Saisie manuelle d'un paiement en espèces
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

        return response()->json([
            'message' => 'Paiement en espèces enregistré',
            'cotisation' => $cotisation,
        ]);
    }

    // Récupérer l'historique des cotisations d'un pot
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