import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Engin } from './engin.entity';
import { Projet } from '../../projets/entities/projet.entity';

@Entity('affectations_engins')
export class AffectationEngin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Engin, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'engin_id' })
  engin: Engin;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date', nullable: true })
  dateFin: Date;

  @Column({ nullable: true })
  observations: string;

  @CreateDateColumn()
  creeLe: Date;
}
