<?php

namespace App\Http\Controllers;

use App\Models\Membre;
use App\Models\Document;
use App\Models\Pot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Services\AuditService;

class MembreController extends Controller
{
    public function index($pot_id)
    {
        $membres = Membre::where('pot_id', $pot_id)->with('documents')->get();
        return response()->json($membres);
    }

    public function store(Request $request)
    {
        $request->validate([
            'pot_id' => 'required|exists:pots,id',
            'nom' => 'required|string|max:255',
            'telephone' => 'required|string',
            'adresse' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
            'consentement' => 'required|boolean',
        ]);

        $pot = Pot::where('id', $request->pot_id)->where('tresorier_id', Auth::id())->first();
        if (!$pot) return response()->json(['message' => 'Non autorisé'], 403);

        $data = $request->except(['photo', 'consentement']);
        $data['consentement_date'] = $request->consentement ? now() : null;

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('photos', 'public');
        }

        $membre = Membre::create($data);
        AuditService::log('creation_membre', "Ajout du membre '{$membre->nom}'", 'membres', $membre->id);
        return response()->json($membre, 201);
    }

    public function show(Membre $membre)
    {
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);
        return response()->json($membre->load('documents'));
    }

    public function update(Request $request, Membre $membre)
    {
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);
        $membre->update($request->all());
        AuditService::log('modification_membre', "Modification du membre '{$membre->nom}'", 'membres', $membre->id);
        return response()->json($membre);
    }

    public function destroy(Membre $membre)
    {
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);
        $nom = $membre->nom;
        foreach ($membre->documents as $doc) {
            Storage::disk('public')->delete($doc->chemin_fichier);
            $doc->delete();
        }
        if ($membre->photo) Storage::disk('public')->delete($membre->photo);
        $membre->delete();
        AuditService::log('suppression_membre', "Suppression du membre '{$nom}'", 'membres', $membre->id);
        return response()->json(['message' => 'Membre supprimé']);
    }

    public function addDocument(Request $request, Membre $membre)
    {
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        $request->validate([
            'type' => 'required|in:cni_recto,cni_verso,autre_garantie',
            'fichier' => 'required|file|max:5120',
        ]);

        $path = $request->file('fichier')->store('documents', 'public');

        $document = Document::create([
            'membre_id' => $membre->id,
            'type' => $request->type,
            'chemin_fichier' => $path,
            'chiffre' => true,
        ]);

        AuditService::log('ajout_document', "Ajout d'un document de type '{$request->type}'", 'documents', $document->id);
        return response()->json($document, 201);
    }

    public function deleteDocument(Document $document)
    {
        $membre = $document->membre;
        if ($membre->pot->tresorier_id !== Auth::id()) return response()->json(['message' => 'Non autorisé'], 403);

        Storage::disk('public')->delete($document->chemin_fichier);
        $document->delete();
        AuditService::log('suppression_document', "Suppression d'un document", 'documents', $document->id);
        return response()->json(['message' => 'Document supprimé']);
    }
}