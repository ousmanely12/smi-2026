<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'membre_id',
        'type',
        'chemin_fichier',
        'chiffre',
    ];

    public function membre()
    {
        return $this->belongsTo(Membre::class);
    }
}