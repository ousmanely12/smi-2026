import {
  Column, Entity, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum CategoriePersonnel {
  ENCADREMENT = 'encadrement',      // Chef chantier, conducteur travaux, géomètre
  OUVRIER_QUALIFIE = 'ouvrier_qualifie', // Maçon, ferrailleur, plombier
  MANOEUVRE = 'manoeuvre',          // Porteur, terrassier
  TACHERONNAGE = 'tacheronnage',    // Équipe à la tâche/forfait
  SAISONNIER = 'saisonnier',
}

export enum TypeContrat {
  CDI = 'cdi',
  CDD = 'cdd',
  JOURNALIER = 'journalier',
  TACHERONNAGE = 'tacheronnage',
}

// SMIG Sénégal 2026 : 60 000 FCFA/mois = 2 333 FCFA/jour
export const SMIG_JOURNALIER_2026 = 2333;
export const SMIG_MENSUEL_2026 = 60000;

@Entity('personnel')
export class Personnel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  poste: string; // Maçon, Chef de chantier, Électricien...

  @Column({ type: 'enum', enum: CategoriePersonnel })
  categorie: CategoriePersonnel;

  @Column({ type: 'enum', enum: TypeContrat })
  typeContrat: TypeContrat;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tauxJournalier: number; // FCFA/jour

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaireMensuel: number; // FCFA/mois

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  numeroCNI: string;

  @Column({ nullable: true })
  numeroIPRES: string; // Immatriculation IPRES retraite

  @Column({ nullable: true })
  numeroCSS: string;  // Caisse Sécurité Sociale

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn()
  creeLe: Date;

  @UpdateDateColumn()
  misAJourLe: Date;
}
