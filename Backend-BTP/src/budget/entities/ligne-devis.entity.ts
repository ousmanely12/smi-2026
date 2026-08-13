import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';

export enum RubriqueDevis {
  MAIN_OEUVRE = 'main_oeuvre',
  MATERIAUX = 'materiaux',
  MATERIEL_ENGINS = 'materiel_engins',
  SOUS_TRAITANCE = 'sous_traitance',
  FRAIS_CHANTIER = 'frais_chantier',
  FRAIS_GENERAUX = 'frais_generaux',
  IMPREVUS = 'imprevus',
  BENEFICE = 'benefice',
}

@Entity('lignes_devis')
export class LigneDevis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'enum', enum: RubriqueDevis })
  rubrique: RubriqueDevis;

  @Column()
  designation: string;

  @Column()
  unite: string; // m3, ml, kg, sac, jour-homme, forfait...

  @Column({ type: 'decimal', precision: 15, scale: 3 })
  quantite: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  prixUnitaire: number; // en FCFA

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  montantHT: number; // Calculé = quantite * prixUnitaire (mis à jour par le service)


  @Column({ nullable: true })
  lot: string; // Référence au lot WBS

  @Column({ type: 'int', default: 0 })
  ordre: number; // Pour l'affichage ordonné

  @CreateDateColumn()
  creeLe: Date;
}
