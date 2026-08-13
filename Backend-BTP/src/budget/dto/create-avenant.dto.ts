import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, IsInt } from 'class-validator';
import { StatutAvenant } from '../entities/avenant.entity';

export class CreateAvenantDto {
  @IsInt() numero: number;
  @IsNotEmpty() @IsString() motif: string;
  @IsNumber() montant: number; // peut être négatif
  @IsOptional() @IsInt() prolongationJours?: number;
  @IsOptional() @IsEnum(StatutAvenant) statut?: StatutAvenant;
  @IsOptional() @IsDateString() dateSignature?: string;
  @IsOptional() @IsString() description?: string;
}
