<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tresorier_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->integer('montant');
            $table->enum('periode', ['quotidienne', 'hebdomadaire', 'mensuelle']);
            $table->date('date_debut');
            $table->text('regle_sortie')->nullable();
            $table->boolean('archive')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pots');
    }
};