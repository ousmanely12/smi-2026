import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { RubriqueDevis } from '../entities/ligne-devis.entity';

export class CreateLigneDevisDto {
  @IsEnum(RubriqueDevis) rubrique: RubriqueDevis;
  @IsNotEmpty() @IsString() designation: string;
  @IsNotEmpty() @IsString() unite: string;
  @IsNumber() @Min(0) quantite: number;
  @IsNumber() @Min(0) prixUnitaire: number;
  @IsOptional() @IsString() lot?: string;
  @IsOptional() @IsInt() ordre?: number;
}
