<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Attestation de participation</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; margin: 40px; color: #211D18; }
        .header { text-align: center; border-bottom: 2px solid #1E3A5F; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #1E3A5F; margin: 0; }
        .header p { color: #5B5548; margin: 5px 0 0 0; }
        .info { margin: 20px 0; }
        .info table { width: 100%; border-collapse: collapse; }
        .info table td { padding: 8px 0; }
        .info .label { font-weight: bold; color: #5B5548; width: 30%; }
        .info .value { color: #211D18; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #5B5548; border-top: 1px solid #E4EBF1; padding-top: 20px; }
        .stamp { display: inline-block; border: 1px solid #3F7A4E; color: #3F7A4E; padding: 6px 12px; border-radius: 6px; font-size: 11px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📜 Attestation de participation</h1>
        <p>Application de gestion de tontine</p>
    </div>

    <div class="info">
        <table>
            <tr><td class="label">Pot</td><td class="value">{{ $pot->nom }}</td></tr>
            <tr><td class="label">Membre</td><td class="value">{{ $membre->nom }}</td></tr>
            <tr><td class="label">Téléphone</td><td class="value">{{ $membre->telephone }}</td></tr>
            <tr><td class="label">Période</td><td class="value">{{ $periode }}</td></tr>
            <tr><td class="label">Total cotisé</td><td class="value">{{ number_format($total_cotise, 0, ',', ' ') }} FCFA</td></tr>
            <tr><td class="label">Date de l'attestation</td><td class="value">{{ $date }}</td></tr>
        </table>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <div class="stamp">✓ Attestation valide · Registre vérifié</div>
    </div>

    <div class="footer">
        <p>Ce document atteste de la participation régulière du membre à la tontine.</p>
        <p>Registre scellé cryptographiquement.</p>
    </div>
</body>
</html>