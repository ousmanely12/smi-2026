import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { CategorieDepense, TypeDepense } from '../entities/depense.entity';

export class CreateDepenseDto {
  @IsEnum(TypeDepense) type: TypeDepense;
  @IsOptional() @IsEnum(CategorieDepense) categorie?: CategorieDepense;
  @IsNumber() @Min(0) montant: number;
  @IsNotEmpty() @IsString() libelle: string;
  @IsDateString() date: string;
  @IsOptional() @IsString() fournisseur?: string;
  @IsOptional() @IsString() referenceFacture?: string;
  @IsOptional() @IsString() saisiePar?: string;
}
