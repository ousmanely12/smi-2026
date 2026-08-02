<?php

namespace App\Http\Controllers;

use App\Models\Membre;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function rappelCotisation(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'urgence' => 'sometimes|boolean',
        ]);

        $membre = Membre::find($request->membre_id);

        if ($membre->pot->tresorier_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $message = "📅 Rappel : votre cotisation est due pour le pot '{$membre->pot->nom}'. Merci de régulariser.";
        $urgence = $request->urgence ?? false;

        NotificationService::sendRappel($membre->telephone, $message, $urgence);

        \App\Services\AuditService::log(
            'envoi_rappel',
            "Envoi d'un rappel à {$membre->nom} (urgence: " . ($urgence ? 'oui' : 'non') . ")",
            'notifications',
            $membre->id
        );

        return response()->json([
            'message' => 'Rappel envoyé',
            'membre' => $membre->nom,
            'telephone' => $membre->telephone,
            'urgence' => $urgence,
        ]);
    }

    public function envoyerRecu(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'montant' => 'required|numeric|min:1',
            'pot_nom' => 'required|string',
        ]);

        $membre = Membre::find($request->membre_id);

        if ($membre->pot->tresorier_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $message = "✅ Reçu de paiement\n"
                 . "Pot : {$request->pot_nom}\n"
                 . "Membre : {$membre->nom}\n"
                 . "Montant : {$request->montant} FCFA\n"
                 . "Date : " . now()->format('d/m/Y H:i') . "\n"
                 . "Merci pour votre confiance.";

        NotificationService::sendWhatsApp($membre->telephone, $message, 'recu');

        \App\Services\AuditService::log(
            'envoi_recu',
            "Envoi d'un reçu à {$membre->nom} pour un montant de {$request->montant} FCFA",
            'notifications',
            $membre->id
        );

        return response()->json([
            'message' => 'Reçu envoyé par WhatsApp',
            'membre' => $membre->nom,
            'telephone' => $membre->telephone,
        ]);
    }

    public function escaladeAppel(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'message' => 'required|string',
        ]);

        $membre = Membre::find($request->membre_id);

        if ($membre->pot->tresorier_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $message = "🔴 URGENT : " . $request->message;
        NotificationService::call($membre->telephone, $message);

        \App\Services\AuditService::log(
            'escalade_appel',
            "Appel vocal d'escalade envoyé à {$membre->nom}",
            'notifications',
            $membre->id
        );

        return response()->json([
            'message' => 'Appel vocal déclenché',
            'membre' => $membre->nom,
            'telephone' => $membre->telephone,
        ]);
    }
}