import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';
import { Fournisseur } from './fournisseur.entity';

export enum StatutBonCommande {
  DEMANDE = 'demande',
  VALIDE = 'valide',
  EN_LIVRAISON = 'en_livraison',
  RECEPTIONNE = 'receptionne',
  ANNULE = 'annule',
}

@Entity('bons_commande')
export class BonCommande {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @ManyToOne(() => Fournisseur)
  @JoinColumn({ name: 'fournisseur_id' })
  fournisseur: Fournisseur;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  montantTotal: number; // FCFA

  @Column({ type: 'enum', enum: StatutBonCommande, default: StatutBonCommande.DEMANDE })
  statut: StatutBonCommande;

  // CDC §9.1 : < 500k FCFA → Chef Projet ; > 500k → DG
  @Column({ nullable: true })
  validePar: string;

  @Column({ type: 'date', nullable: true })
  dateValidation: Date;

  @Column({ type: 'date', nullable: true })
  dateLivraisonPrevue: Date;

  @Column({ nullable: true })
  observations: string;

  @CreateDateColumn()
  creeLe: Date;
}
