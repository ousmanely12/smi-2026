import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fournisseur } from './entities/fournisseur.entity';
import { BonCommande } from './entities/bon-commande.entity';
import { MouvementStock, TypeMouvement } from './entities/mouvement-stock.entity';

@Injectable()
export class ApprovisionnementsService {
  constructor(
    @InjectRepository(Fournisseur) private fournisseurRepo: Repository<Fournisseur>,
    @InjectRepository(BonCommande) private bcRepo: Repository<BonCommande>,
    @InjectRepository(MouvementStock) private mouvementRepo: Repository<MouvementStock>,
  ) {}

  // ─── FOURNISSEURS ─────────────────────────────────────────────────────────
  createFournisseur(dto: Partial<Fournisseur>) { return this.fournisseurRepo.save(this.fournisseurRepo.create(dto)); }
  findAllFournisseurs() { return this.fournisseurRepo.find({ where: { actif: true } }); }

  // ─── BONS DE COMMANDE ─────────────────────────────────────────────────────
  createBonCommande(projetId: string, dto: any) {
    return this.bcRepo.save(this.bcRepo.create({
      ...dto,
      projet: { id: projetId } as any,
      fournisseur: { id: dto.fournisseurId } as any,
    }));
  }
  getBonsCommande(projetId: string) {
    return this.bcRepo.find({ where: { projet: { id: projetId } }, relations: { fournisseur: true }, order: { creeLe: 'DESC' } });
  }

  // ─── MOUVEMENTS STOCK ─────────────────────────────────────────────────────
  createMouvement(projetId: string, dto: Partial<MouvementStock>) {
    return this.mouvementRepo.save(this.mouvementRepo.create({ ...dto, projet: { id: projetId } as any }));
  }
  getMouvements(projetId: string) {
    return this.mouvementRepo.find({ where: { projet: { id: projetId } }, order: { date: 'DESC' } });
  }

  // Calcul stock théorique par matériau (entrées - sorties)
  async getStockChantier(projetId: string) {
    const mouvements = await this.getMouvements(projetId);
    const stockMap: Record<string, { materiau: string; unite: string; quantite: number }> = {};
    mouvements.forEach(m => {
      const key = `${m.materiau}__${m.unite}`;
      if (!stockMap[key]) stockMap[key] = { materiau: m.materiau, unite: m.unite, quantite: 0 };
      stockMap[key].quantite += m.type === TypeMouvement.ENTREE ? Number(m.quantite) : -Number(m.quantite);
    });
    return Object.values(stockMap);
  }
}
