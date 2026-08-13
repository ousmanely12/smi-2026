import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';

export enum TypeIncident {
  SECURITE = 'securite',
  QUALITE = 'qualite',
  MATERIEL = 'materiel',
  APPROVISIONNEMENT = 'approvisionnement',
  AUTRE = 'autre',
}

export enum GraviteIncident {
  FAIBLE = 'faible',
  MOYEN = 'moyen',
  GRAVE = 'grave',
  CRITIQUE = 'critique',
}

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: TypeIncident })
  type: TypeIncident;

  @Column({ type: 'enum', enum: GraviteIncident })
  gravite: GraviteIncident;

  @Column()
  description: string;

  @Column({ type: 'text', nullable: true })
  actionsCorrectives: string;

  @Column({ default: false })
  declareCss: boolean; // Déclaré à la CSS (accidents du travail)

  @Column({ nullable: true })
  declarePar: string;

  @CreateDateColumn()
  creeLe: Date;
}
