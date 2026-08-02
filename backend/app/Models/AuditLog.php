<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'auteur',
        'description',
        'table_affectee',
        'ligne_id',
        'signature_sha256',
    ];

    // Méthode pour générer une signature SHA-256
    public static function generateSignature($data)
    {
        return hash('sha256', json_encode($data) . now()->timestamp);
    }
}