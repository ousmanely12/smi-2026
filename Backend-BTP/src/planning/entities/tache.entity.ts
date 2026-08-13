import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';

export enum StatutTache {
  A_FAIRE = 'a_faire',
  EN_COURS = 'en_cours',
  TERMINEE = 'terminee',
  EN_RETARD = 'en_retard',
  SUSPENDUE = 'suspendue',
}

export enum LotWBS {
  INSTALLATION_CHANTIER = 'installation_chantier',
  TERRASSEMENT = 'terrassement',
  FONDATIONS = 'fondations',
  GROS_OEUVRE = 'gros_oeuvre',
  CHARPENTE_COUVERTURE = 'charpente_couverture',
  MENUISERIES = 'menuiseries',
  PLOMBERIE_SANITAIRE = 'plomberie_sanitaire',
  ELECTRICITE = 'electricite',
  REVETEMENTS = 'revetements',
  VRD_AMENAGEMENTS = 'vrd_amenagements',
  AUTRE = 'autre',
}

@Entity('taches')
export class Tache {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column()
  nom: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: LotWBS, default: LotWBS.AUTRE })
  lot: LotWBS;

  @Column({ type: 'date', nullable: true })
  dateDebutPrevue: Date;

  @Column({ type: 'date', nullable: true })
  dateFinPrevue: Date;

  @Column({ type: 'date', nullable: true })
  dateDebutReelle: Date;

  @Column({ type: 'date', nullable: true })
  dateFinReelle: Date;

  @Column({ type: 'int', nullable: true })
  dureeJours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  pourcentageAvancement: number;

  @Column({ type: 'enum', enum: StatutTache, default: StatutTache.A_FAIRE })
  statut: StatutTache;

  // Référence à la tâche précédente (relation Fin-Début)
  @Column({ nullable: true })
  tachePrecedenteId: string;

  @Column({ nullable: true })
  responsable: string;

  @CreateDateColumn()
  creeLe: Date;

  @UpdateDateColumn()
  misAJourLe: Date;
}
