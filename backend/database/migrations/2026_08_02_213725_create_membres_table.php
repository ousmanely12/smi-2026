<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pot_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->string('telephone');
            $table->string('adresse')->nullable();
            $table->string('photo')->nullable();
            $table->timestamp('consentement_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membres');
    }
};