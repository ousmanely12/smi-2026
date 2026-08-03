<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class RegistreController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::query();

        if ($request->has('action')) $query->where('action', $request->action);
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'LIKE', "%$search%")
                  ->orWhere('auteur', 'LIKE', "%$search%");
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function verifierIntegrite()
    {
        $logs = AuditLog::all();
        $verification = [];

        foreach ($logs as $log) {
            $data = [
                'action' => $log->action,
                'auteur' => $log->auteur,
                'description' => $log->description,
                'table' => $log->table_affectee,
                'row_id' => $log->ligne_id,
                'timestamp' => $log->created_at->timestamp,
            ];
            $signatureCalculee = hash('sha256', json_encode($data));

            $verification[] = [
                'id' => $log->id,
                'signature_actuelle' => $log->signature_sha256,
                'signature_calculee' => $signatureCalculee,
                'valide' => $log->signature_sha256 === $signatureCalculee,
            ];
        }

        $toutesValides = collect($verification)->every(fn($v) => $v['valide']);

        return response()->json([
            'message' => $toutesValides ? '✅ Registre intègre' : '❌ Registre modifié !',
            'verification' => $verification,
        ]);
    }

    public function exporter()
    {
        return response()->json(['message' => 'Export PDF généré (simulation)', 'data' => AuditLog::all()]);
    }
}