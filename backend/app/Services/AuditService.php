<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

class AuditService
{
    public static function log($action, $description, $table = null, $rowId = null)
    {
        $auteur = Auth::check() ? 'tresorier' : 'systeme';

        $data = [
            'action' => $action,
            'auteur' => $auteur,
            'description' => $description,
            'table' => $table,
            'row_id' => $rowId,
            'timestamp' => now()->timestamp,
        ];

        $signature = AuditLog::generateSignature($data);

        return AuditLog::create([
            'action' => $action,
            'auteur' => $auteur,
            'description' => $description,
            'table_affectee' => $table,
            'ligne_id' => $rowId,
            'signature_sha256' => $signature,
        ]);
    }
}