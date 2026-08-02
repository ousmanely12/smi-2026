<?php

namespace App\Http\Controllers;

use App\Models\Membre;
use App\Models\Document;
use App\Models\Pot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
        if (!$pot) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $data = $request->except(['photo', 'consentement']);
        $data['consentement_date'] = $request->consentement ? now() : null;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('photos', 'public');
            $data['photo'] = $path;
        }

        $membre = Membre::create($data);
        return response()->json($membre, 201);
    }

    public function show(Membre $membre)
    {
        $this->authorizeMembre($membre);
        return response()->json($membre->load('documents'));
    }

    public function update(Request $request, Membre $membre)
    {
        $this->authorizeMembre($membre);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string',
            'adresse' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
            'consentement' => 'sometimes|boolean',
        ]);

        $data = $request->except(['photo', 'consentement']);
        if ($request->has('consentement')) {
            $data['consentement_date'] = $request->consentement ? now() : null;
        }

        if ($request->hasFile('photo')) {
            if ($membre->photo) {
                Storage::disk('public')->delete($membre->photo);
            }
            $path = $request->file('photo')->store('photos', 'public');
            $data['photo'] = $path;
        }

        $membre->update($data);
        return response()->json($membre);
    }

    public function destroy(Membre $membre)
    {
        $this->authorizeMembre($membre);

        foreach ($membre->documents as $doc) {
            Storage::disk('public')->delete($doc->chemin_fichier);
            $doc->delete();
        }
        if ($membre->photo) {
            Storage::disk('public')->delete($membre->photo);
        }
        $membre->delete();

        return response()->json(['message' => 'Membre supprimé']);
    }

    public function addDocument(Request $request, Membre $membre)
    {
        $this->authorizeMembre($membre);

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

        return response()->json($document, 201);
    }

    public function deleteDocument(Document $document)
    {
        $membre = $document->membre;
        $this->authorizeMembre($membre);

        Storage::disk('public')->delete($document->chemin_fichier);
        $document->delete();

        return response()->json(['message' => 'Document supprimé']);
    }

    private function authorizeMembre($membre)
    {
        if ($membre->pot->tresorier_id !== Auth::id()) {
            abort(403, 'Non autorisé');
        }
    }
}