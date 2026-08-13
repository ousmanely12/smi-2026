import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';

export enum TypeJalon {
  CONTRACTUEL = 'contractuel',
  INTERNE = 'interne',
  REGLEMENTAIRE = 'reglementaire',
}

@Entity('jalons')
export class Jalon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column()
  nom: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TypeJalon, default: TypeJalon.INTERNE })
  type: TypeJalon;

  @Column({ type: 'date' })
  datePrevu: Date;

  @Column({ type: 'date', nullable: true })
  dateReel: Date;

  @Column({ default: false })
  atteint: boolean;

  @CreateDateColumn()
  creeLe: Date;
}
