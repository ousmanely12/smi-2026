<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pot extends Model
{
    use HasFactory;

    protected $fillable = [
        'tresorier_id',
        'nom',
        'montant',
        'periode',
        'date_debut',
        'regle_sortie',
        'archive',
    ];

    public function tresorier()
    {
        return $this->belongsTo(Tresorier::class);
    }

    public function membres()
    {
        return $this->hasMany(Membre::class);
    }
}