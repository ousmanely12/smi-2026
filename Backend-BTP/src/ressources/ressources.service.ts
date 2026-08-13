import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Personnel, SMIG_JOURNALIER_2026 } from './entities/personnel.entity';
import { Pointage, StatutPresence } from './entities/pointage.entity';
import { Engin } from './entities/engin.entity';
import { SousTraitant } from './entities/sous-traitant.entity';

@Injectable()
export class RessourcesService {
  constructor(
    @InjectRepository(Personnel) private personnelRepo: Repository<Personnel>,
    @InjectRepository(Pointage) private pointageRepo: Repository<Pointage>,
    @InjectRepository(Engin) private enginRepo: Repository<Engin>,
    @InjectRepository(SousTraitant) private sousTraitantRepo: Repository<SousTraitant>,
  ) {}

  // ─── PERSONNEL ────────────────────────────────────────────────────────────
  createPersonnel(dto: Partial<Personnel>) { return this.personnelRepo.save(this.personnelRepo.create(dto)); }
  findAllPersonnel() { return this.personnelRepo.find({ where: { actif: true } }); }
  async findPersonnel(id: string) {
    const p = await this.personnelRepo.findOneBy({ id });
    if (!p) throw new NotFoundException(`Personnel "${id}" introuvable.`);
    return p;
  }
  async updatePersonnel(id: string, dto: Partial<Personnel>) {
    await this.findPersonnel(id);
    await this.personnelRepo.update(id, dto);
    return this.personnelRepo.findOneBy({ id });
  }

  // ─── POINTAGE ─────────────────────────────────────────────────────────────
  async createPointage(dto: Partial<Pointage> & { personnelId: string; projetId: string }): Promise<Pointage> {
    const personnel = await this.findPersonnel(dto.personnelId);
    // Calcul automatique du montant journalier (SMIG si pas de taux spécifique)
    const tauxJour = Number(personnel.tauxJournalier) || SMIG_JOURNALIER_2026;
    let montantJournalier = dto.statut === StatutPresence.DEMI_JOURNEE ? tauxJour / 2 : tauxJour;
    if (dto.statut === StatutPresence.ABSENT || dto.statut === StatutPresence.CONGE) montantJournalier = 0;
    // Heures sup +25%
    const hSup = Number(dto.heuresSupplementaires || 0);
    montantJournalier += hSup * (tauxJour / 8) * 1.25;

    const pointage = this.pointageRepo.create({
      ...dto,
      personnel: { id: dto.personnelId } as any,
      projet: { id: dto.projetId } as any,
      montantJournalier: Math.round(montantJournalier),
    });
    return this.pointageRepo.save(pointage);
  }

  getPointagesProjet(projetId: string) {
    return this.pointageRepo.find({ where: { projet: { id: projetId } }, relations: { personnel: true }, order: { date: 'DESC' } });
  }

  // Calcul feuille de paie hebdomadaire/mensuelle
  async getMasseSalariale(projetId: string, debut: string, fin: string) {
    const pointages = await this.pointageRepo.find({ where: { projet: { id: projetId } }, relations: { personnel: true } });
    const total = pointages.reduce((s, p) => s + Number(p.montantJournalier || 0), 0);
    return { projetId, debut, fin, totalFCFA: total, nombrePointages: pointages.length };
  }

  // ─── ENGINS ───────────────────────────────────────────────────────────────
  createEngin(dto: Partial<Engin>) { return this.enginRepo.save(this.enginRepo.create(dto)); }
  findAllEngins() { return this.enginRepo.find(); }

  // ─── SOUS-TRAITANTS ───────────────────────────────────────────────────────
  createSousTraitant(dto: Partial<SousTraitant>) { return this.sousTraitantRepo.save(this.sousTraitantRepo.create(dto)); }
  findAllSousTraitants() { return this.sousTraitantRepo.find({ where: { actif: true } }); }
}
