import {
  Column, Entity, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum SpecialiteSousTraitant {
  ELECTRICITE = 'electricite',
  PLOMBERIE = 'plomberie',
  MENUISERIE_ALU = 'menuiserie_alu',
  MENUISERIE_BOIS = 'menuiserie_bois',
  PEINTURE = 'peinture',
  CARRELAGE = 'carrelage',
  ETANCHEITE = 'etancheite',
  VRD = 'vrd',
  TERRASSEMENT = 'terrassement',
  GROS_OEUVRE = 'gros_oeuvre',
  AUTRE = 'autre',
}

@Entity('sous_traitants')
export class SousTraitant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string; // Raison sociale

  @Column({ nullable: true })
  nomGerant: string;

  @Column({ nullable: true, unique: true })
  NINEA: string;

  @Column({ nullable: true })
  RCCM: string;

  @Column({ type: 'enum', enum: SpecialiteSousTraitant })
  specialite: SpecialiteSousTraitant;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  evaluation: number; // Note /10 après prestation

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn()
  creeLe: Date;

  @UpdateDateColumn()
  misAJourLe: Date;
}
