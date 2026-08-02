<?php

namespace App\Http\Controllers;

use App\Models\Pot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PotController extends Controller
{
    public function index()
    {
        $pots = Pot::where('tresorier_id', Auth::id())->get();
        return response()->json($pots);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'montant' => 'required|integer|min:1',
            'periode' => 'required|in:quotidienne,hebdomadaire,mensuelle',
            'date_debut' => 'required|date',
            'regle_sortie' => 'nullable|string',
        ]);

        $pot = Pot::create([
            'tresorier_id' => Auth::id(),
            'nom' => $request->nom,
            'montant' => $request->montant,
            'periode' => $request->periode,
            'date_debut' => $request->date_debut,
            'regle_sortie' => $request->regle_sortie,
        ]);

        return response()->json($pot, 201);
    }

    public function show(Pot $pot)
    {
        if ($pot->tresorier_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        return response()->json($pot);
    }

    public function update(Request $request, Pot $pot)
    {
        if ($pot->tresorier_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'montant' => 'sometimes|integer|min:1',
            'periode' => 'sometimes|in:quotidienne,hebdomadaire,mensuelle',
            'date_debut' => 'sometimes|date',
            'regle_sortie' => 'nullable|string',
        ]);

        $pot->update($request->all());
        return response()->json($pot);
    }

    public function destroy(Pot $pot)
    {
        if ($pot->tresorier_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $pot->delete();
        return response()->json(['message' => 'Pot supprimé']);
    }
}