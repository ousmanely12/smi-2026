<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;

class PdfService
{
    public static function genererRecu($membre, $pot, $montant, $reference)
    {
        $pdf = Pdf::loadView('pdfs.recu', [
            'membre' => $membre,
            'pot' => $pot,
            'montant' => $montant,
            'reference' => $reference,
            'date' => now()->format('d/m/Y H:i'),
        ]);

        return ['pdf' => $pdf, 'filename' => "recu_{$reference}.pdf"];
    }

    public static function genererAttestation($membre, $pot, $periode, $totalCotise)
    {
        $pdf = Pdf::loadView('pdfs.attestation', [
            'membre' => $membre,
            'pot' => $pot,
            'periode' => $periode,
            'total_cotise' => $totalCotise,
            'date' => now()->format('d/m/Y'),
        ]);

        return ['pdf' => $pdf, 'filename' => "attestation_{$membre->id}.pdf"];
    }
}