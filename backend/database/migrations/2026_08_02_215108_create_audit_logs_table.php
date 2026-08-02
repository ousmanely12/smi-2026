<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('action'); // 'creation_pot', 'modification_membre', 'paiement', etc.
            $table->string('auteur'); // 'systeme' ou 'tresorier'
            $table->text('description');
            $table->string('table_affectee')->nullable();
            $table->unsignedBigInteger('ligne_id')->nullable();
            $table->string('signature_sha256')->unique(); // empreinte cryptographique
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};