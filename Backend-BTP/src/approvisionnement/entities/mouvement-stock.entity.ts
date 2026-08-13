import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';

export enum TypeMouvement {
  ENTREE = 'entree',  // Réception chantier
  SORTIE = 'sortie',  // Utilisation sur chantier
}

@Entity('mouvements_stock')
export class MouvementStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Projet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'enum', enum: TypeMouvement })
  type: TypeMouvement;

  @Column()
  materiau: string; // Ciment, Fer à béton, Parpaings, Sable...

  @Column()
  unite: string; // Sac, kg, m3, ml, unité

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  quantite: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  prixUnitaire: number; // FCFA

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  referenceBonLivraison: string;

  @Column({ nullable: true })
  responsable: string; // Magasinier qui valide

  @Column({ nullable: true })
  lot: string; // Lot WBS de destination (sortie)

  @Column({ nullable: true })
  observations: string;

  @CreateDateColumn()
  creeLe: Date;
}
