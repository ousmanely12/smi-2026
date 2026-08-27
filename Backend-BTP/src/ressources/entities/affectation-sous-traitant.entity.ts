import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { SousTraitant } from './sous-traitant.entity';
import { Projet } from '../../projets/entities/projet.entity';

@Entity('affectations_sous_traitants')
export class AffectationSousTraitant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SousTraitant, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'sous_traitant_id' })
  sousTraitant: SousTraitant;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date', nullable: true })
  dateFin: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  montantContrat: number;

  @Column({ nullable: true })
  observations: string;

  @CreateDateColumn()
  creeLe: Date;
}
