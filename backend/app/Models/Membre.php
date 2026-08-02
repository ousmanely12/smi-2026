<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Membre extends Model
{
    use HasFactory;

    protected $fillable = [
        'pot_id',
        'nom',
        'telephone',
        'adresse',
        'photo',
        'consentement_date',
    ];

    public function pot()
    {
        return $this->belongsTo(Pot::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}