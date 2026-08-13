import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';

export enum TypeDepense {
  ENGAGEMENT = 'engagement',    // Bon de commande validé
  REALISATION = 'realisation',  // Facture réceptionnée et payée
}

export enum CategorieDepense {
  MAIN_OEUVRE = 'main_oeuvre',
  MATERIAUX = 'materiaux',
  MATERIEL = 'materiel',
  SOUS_TRAITANCE = 'sous_traitance',
  FRAIS_GENERAUX = 'frais_generaux',
  AUTRE = 'autre',
}

@Entity('depenses')
export class Depense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'enum', enum: TypeDepense })
  type: TypeDepense;

  @Column({ type: 'enum', enum: CategorieDepense, default: CategorieDepense.AUTRE })
  categorie: CategorieDepense;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  montant: number; // FCFA

  @Column()
  libelle: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  fournisseur: string;

  @Column({ nullable: true })
  referenceFacture: string;

  @Column({ nullable: true })
  saisiePar: string;

  @CreateDateColumn()
  creeLe: Date;
}
