import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';
import { TypeJalon } from '../entities/jalon.entity';

export class CreateJalonDto {
  @IsNotEmpty() @IsString()
  nom: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsEnum(TypeJalon)
  type?: TypeJalon;

  @IsNotEmpty() @IsDateString()
  datePrevu: string;

  @IsOptional() @IsDateString()
  dateReel?: string;

  @IsOptional() @IsBoolean()
  atteint?: boolean;
}
