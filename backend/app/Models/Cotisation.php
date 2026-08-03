<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cotisation extends Model
{
    use HasFactory;

    protected $fillable = [
        'membre_id', 'pot_id', 'montant', 'mode_paiement', 'statut',
        'reference_externe', 'qr_code', 'auteur', 'date_paiement'
    ];

    public function membre()
    {
        return $this->belongsTo(Membre::class);
    }

    public function pot()
    {
        return $this->belongsTo(Pot::class);
    }
}