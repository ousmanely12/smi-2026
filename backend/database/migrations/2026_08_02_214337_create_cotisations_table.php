<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cotisations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('membre_id')->constrained()->onDelete('cascade');
            $table->foreignId('pot_id')->constrained()->onDelete('cascade');
            $table->integer('montant');
            $table->enum('mode_paiement', ['wave', 'orange_money', 'free_money', 'especes']);
            $table->enum('statut', ['en_attente', 'confirme'])->default('en_attente');
            $table->string('reference_externe')->nullable(); // lien de paiement ou référence
            $table->string('qr_code')->nullable(); // chemin du QR code
            $table->string('auteur')->nullable(); // 'systeme' ou 'tresorier'
            $table->timestamp('date_paiement')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cotisations');
    }
};