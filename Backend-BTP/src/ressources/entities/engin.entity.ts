import {
  Column, Entity, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum TypeEngin {
  PROPRE = 'propre',
  LOUE = 'loue',
}

export enum StatutEngin {
  DISPONIBLE = 'disponible',
  EN_SERVICE = 'en_service',
  EN_MAINTENANCE = 'en_maintenance',
  HORS_SERVICE = 'hors_service',
}

@Entity('engins')
export class Engin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  designation: string; // Pelle mécanique, Niveleuse, Compacteur...

  @Column({ nullable: true })
  immatriculation: string;

  @Column({ nullable: true })
  marque: string;

  @Column({ nullable: true })
  modele: string;

  @Column({ type: 'enum', enum: TypeEngin, default: TypeEngin.PROPRE })
  type: TypeEngin;

  @Column({ type: 'enum', enum: StatutEngin, default: StatutEngin.DISPONIBLE })
  statut: StatutEngin;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tauxHoraire: number; // FCFA/heure

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tauxJournalier: number; // FCFA/jour

  @Column({ type: 'int', nullable: true })
  kilometrage: number;

  @Column({ type: 'date', nullable: true })
  prochaineRevision: Date;

  @Column({ nullable: true })
  fournisseurLocation: string; // Si loué

  @CreateDateColumn()
  creeLe: Date;

  @UpdateDateColumn()
  misAJourLe: Date;
}
