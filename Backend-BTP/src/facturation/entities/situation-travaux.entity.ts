import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany,
  JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';

export enum StatutSituation {
  BROUILLON = 'brouillon',
  SOUMISE = 'soumise',
  VALIDEE = 'validee',
  PAYEE = 'payee',
  REJETEE = 'rejetee',
}

// Taux légaux Sénégal 2026
export const TVA_TAUX = 0.18;         // 18%
export const TCS_TAUX = 0.01;         // 1% Taxe sur Contrats Spéciaux
export const RETENUE_GARANTIE = 0.05; // 5% standard
export const AVANCE_DEMARRAGE = 0.20; // 20% standard

@Entity('situations_travaux')
export class SituationTravaux {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'int' })
  numero: number; // Numéro séquentiel de la situation

  @Column({ type: 'date' })
  mois: Date; // Mois de la situation

  // Montants calculés
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  montantHTCumul: number; // Cumul depuis début travaux

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  montantHTNouveau: number; // Montant de cette situation uniquement

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  avanceDeduire: number; // Déduction avance démarrage prorata

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  retenueGarantie: number; // 5% standard

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  montantTVA: number; // 18%

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  montantTCS: number; // 1% Taxe Contrats Spéciaux

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  netAPayer: number; // Montant net à payer à l'entreprise

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  pourcentageAvancement: number; // % avancement global au moment

  @Column({ type: 'enum', enum: StatutSituation, default: StatutSituation.BROUILLON })
  statut: StatutSituation;

  @Column({ nullable: true })
  validePar: string;

  @Column({ type: 'date', nullable: true })
  dateValidation: Date;

  @Column({ type: 'date', nullable: true })
  datePaiement: Date;

  @CreateDateColumn()
  creeLe: Date;

  @UpdateDateColumn()
  misAJourLe: Date;
}
