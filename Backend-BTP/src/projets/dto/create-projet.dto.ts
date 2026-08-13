import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { StatutProjet, TypeMarche, TypeProjet } from '../entities/projet.entity';

export class CreateProjetDto {
  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsNotEmpty()
  @IsString()
  intitule: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TypeMarche)
  typeMarche: TypeMarche;

  @IsOptional()
  @IsEnum(TypeProjet)
  typeProjet?: TypeProjet;

  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsString()
  commune: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsNotEmpty()
  @IsString()
  maitreOuvrage: string;

  @IsOptional()
  @IsString()
  maitreOeuvre?: string;

  @IsOptional()
  @IsString()
  bureauEtudesTechniques?: string;

  @IsOptional()
  @IsString()
  bureauControle?: string;

  @IsNumber()
  montantMarche: number;

  @IsNotEmpty()
  @IsString()
  sourceFinancement: string;

  @IsOptional()
  @IsNumber()
  retenueGarantiePourcent?: number;

  @IsOptional()
  @IsDateString()
  dateNotification?: string;

  @IsOptional()
  @IsDateString()
  dateDemarrage?: string;

  @IsOptional()
  @IsNumber()
  dureeContractuelleJours?: number;

  @IsOptional()
  @IsDateString()
  dateReceptionProvisoire?: string;

  @IsOptional()
  @IsDateString()
  dateReceptionDefinitive?: string;

  @IsOptional()
  @IsString()
  numeroMarche?: string;

  @IsOptional()
  @IsString()
  referenceAppelOffres?: string;

  @IsOptional()
  @IsString()
  modePassation?: string;

  @IsOptional()
  @IsString()
  nineaClient?: string;

  @IsOptional()
  @IsEnum(StatutProjet)
  statut?: StatutProjet;
}
