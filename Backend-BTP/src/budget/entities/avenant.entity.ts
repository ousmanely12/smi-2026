import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';

export enum StatutAvenant {
  DEMANDE = 'demande',
  EN_NEGOCIATION = 'en_negociation',
  APPROUVE = 'approuve',
  REJETE = 'rejete',
}

@Entity('avenants')
export class Avenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'int' })
  numero: number;

  @Column()
  motif: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  montant: number; // FCFA, peut être négatif (déduction)

  @Column({ type: 'int', nullable: true })
  prolongationJours: number; // Extension de délai associée

  @Column({ type: 'enum', enum: StatutAvenant, default: StatutAvenant.DEMANDE })
  statut: StatutAvenant;

  @Column({ type: 'date', nullable: true })
  dateSignature: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  creeLe: Date;
}
