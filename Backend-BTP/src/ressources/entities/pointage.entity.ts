import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Personnel } from './personnel.entity';
import { Projet } from '../../projets/entities/projet.entity';

export enum StatutPresence {
  PRESENT = 'present',
  ABSENT = 'absent',
  DEMI_JOURNEE = 'demi_journee',
  CONGE = 'conge',
  MALADIE = 'maladie',
}

@Entity('pointages')
export class Pointage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Personnel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personnel_id' })
  personnel: Personnel;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: StatutPresence, default: StatutPresence.PRESENT })
  statut: StatutPresence;

  // Heures supplémentaires selon Code du travail sénégalais (25% à 50%)
  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  heuresSupplementaires: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montantJournalier: number; // Calculé auto selon taux

  @Column({ nullable: true })
  observations: string;

  @Column({ nullable: true })
  saisie_par: string;

  @CreateDateColumn()
  creeLe: Date;
}
