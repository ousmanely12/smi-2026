<?php

namespace App\Http\Controllers;

use App\Models\Membre;
use App\Models\Cotisation;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PdfController extends Controller
{
    public function telechargerRecu(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'montant' => 'required|numeric|min:1',
            'reference' => 'required|string',
        ]);

        $membre = Membre::find($request->membre_id);
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        $result = PdfService::genererRecu($membre, $membre->pot, $request->montant, $request->reference);
        return $result['pdf']->download($result['filename']);
    }

    public function telechargerAttestation(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'periode' => 'required|string',
        ]);

        $membre = Membre::find($request->membre_id);
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        $totalCotise = Cotisation::where('membre_id', $membre->id)->where('statut', 'confirme')->sum('montant');
        $result = PdfService::genererAttestation($membre, $membre->pot, $request->periode, $totalCotise);
        return $result['pdf']->download($result['filename']);
    }

    public function apercuRecu(Request $request)
    {
        $request->validate([
            'membre_id' => 'required|exists:membres,id',
            'montant' => 'required|numeric|min:1',
            'reference' => 'required|string',
        ]);

        $membre = Membre::find($request->membre_id);
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        $result = PdfService::genererRecu($membre, $membre->pot, $request->montant, $request->reference);
        return $result['pdf']->stream($result['filename']);
    }
}