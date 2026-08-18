import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangerMotDePasseDto {
    @IsNotEmpty()
    ancienMotDePasse: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' })
    nouveauMotDePasse: string;
}