<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;

class PdfService
{
    public static function genererRecu($membre, $pot, $montant, $reference)
    {
        $data = [
            'membre' => $membre,
            'pot' => $pot,
            'montant' => $montant,
            'reference' => $reference,
            'date' => now()->format('d/m/Y H:i'),
        ];

        $pdf = Pdf::loadView('pdfs.recu', $data);
        $filename = "recu_{$reference}.pdf";

        return [
            'pdf' => $pdf,
            'filename' => $filename,
            'output' => $pdf->output(),
        ];
    }

    public static function genererAttestation($membre, $pot, $periode, $totalCotise)
    {
        $data = [
            'membre' => $membre,
            'pot' => $pot,
            'periode' => $periode,
            'total_cotise' => $totalCotise,
            'date' => now()->format('d/m/Y'),
        ];

        $pdf = Pdf::loadView('pdfs.attestation', $data);
        $filename = "attestation_{$membre->id}.pdf";

        return [
            'pdf' => $pdf,
            'filename' => $filename,
            'output' => $pdf->output(),
        ];
    }
}