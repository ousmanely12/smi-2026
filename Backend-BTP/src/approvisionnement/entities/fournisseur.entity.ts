import {
  Column, Entity, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum SpecialiteFournisseur {
  CIMENT = 'ciment',
  FER_BETON = 'fer_beton',
  GRANULATS = 'granulats',
  BOIS = 'bois',
  QUINCAILLERIE = 'quincaillerie',
  LOCATION_ENGINS = 'location_engins',
  ELECTRICITE = 'electricite',
  PLOMBERIE = 'plomberie',
  PEINTURE = 'peinture',
  CARBURANT = 'carburant',
  MATERIEL_DIVERS = 'materiel_divers',
}

@Entity('fournisseurs')
export class Fournisseur {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column({ nullable: true, unique: true })
  NINEA: string;

  @Column({ nullable: true })
  RCCM: string;

  @Column({ type: 'enum', enum: SpecialiteFournisseur })
  specialite: SpecialiteFournisseur;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  contactPrincipal: string;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn()
  creeLe: Date;

  @UpdateDateColumn()
  misAJourLe: Date;
}
