<?php

namespace App\Http\Controllers;

use App\Models\Membre;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\AuditService;

class NotificationController extends Controller
{
    public function rappelCotisation(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'urgence' => 'sometimes|boolean',
        ]);

        $membre = Membre::find($request->membre_id);
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        $message = "📅 Rappel : votre cotisation est due pour le pot '{$membre->pot->nom}'. Merci de régulariser.";
        $urgence = $request->urgence ?? false;

        NotificationService::sendRappel($membre->telephone, $message, $urgence);
        AuditService::log('envoi_rappel', "Envoi d'un rappel à {$membre->nom} (urgence: " . ($urgence ? 'oui' : 'non') . ")", 'notifications', $membre->id);

        return response()->json(['message' => 'Rappel envoyé', 'membre' => $membre->nom, 'telephone' => $membre->telephone, 'urgence' => $urgence]);
    }

    public function envoyerRecu(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'montant' => 'required|numeric|min:1',
            'pot_nom' => 'required|string',
        ]);

        $membre = Membre::find($request->membre_id);
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        $message = "✅ Reçu de paiement\nPot : {$request->pot_nom}\nMembre : {$membre->nom}\nMontant : {$request->montant} FCFA\nDate : " . now()->format('d/m/Y H:i') . "\nMerci pour votre confiance.";

        NotificationService::sendWhatsApp($membre->telephone, $message, 'recu');
        AuditService::log('envoi_recu', "Envoi d'un reçu à {$membre->nom}", 'notifications', $membre->id);

        return response()->json(['message' => 'Reçu envoyé par WhatsApp', 'membre' => $membre->nom, 'telephone' => $membre->telephone]);
    }

    public function escaladeAppel(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'message' => 'required|string',
        ]);

        $membre = Membre::find($request->membre_id);
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        NotificationService::call($membre->telephone, "🔴 URGENT : " . $request->message);
        AuditService::log('escalade_appel', "Appel vocal d'escalade envoyé à {$membre->nom}", 'notifications', $membre->id);

        return response()->json(['message' => 'Appel vocal déclenché', 'membre' => $membre->nom, 'telephone' => $membre->telephone]);
    }
}