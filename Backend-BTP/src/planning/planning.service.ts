import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tache } from './entities/tache.entity';
import { Jalon } from './entities/jalon.entity';
import { CreateTacheDto } from './dto/create-tache.dto';
import { CreateJalonDto } from './dto/create-jalon.dto';
import { PartialType } from '@nestjs/mapped-types';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Tache) private tacheRepo: Repository<Tache>,
    @InjectRepository(Jalon) private jalonRepo: Repository<Jalon>,
  ) {}

  // ─── TÂCHES ───────────────────────────────────────────────────────────────
  async createTache(projetId: string, dto: CreateTacheDto): Promise<Tache> {
    const tache = this.tacheRepo.create({ ...dto, projet: { id: projetId } as any });
    return this.tacheRepo.save(tache);
  }

  async findTachesProjet(projetId: string): Promise<Tache[]> {
    return this.tacheRepo.find({ where: { projet: { id: projetId } }, order: { creeLe: 'ASC' } });
  }

  async updateTache(id: string, dto: Partial<CreateTacheDto>): Promise<Tache> {
    const tache = await this.tacheRepo.findOneBy({ id });
    if (!tache) throw new NotFoundException(`Tâche "${id}" introuvable.`);
    Object.assign(tache, dto);
    return this.tacheRepo.save(tache);
  }

  async removeTache(id: string): Promise<void> {
    const tache = await this.tacheRepo.findOneBy({ id });
    if (!tache) throw new NotFoundException(`Tâche "${id}" introuvable.`);
    await this.tacheRepo.delete(id);
  }

  // ─── JALONS ───────────────────────────────────────────────────────────────
  async createJalon(projetId: string, dto: CreateJalonDto): Promise<Jalon> {
    const jalon = this.jalonRepo.create({ ...dto, projet: { id: projetId } as any });
    return this.jalonRepo.save(jalon);
  }

  async findJalonsProjet(projetId: string): Promise<Jalon[]> {
    return this.jalonRepo.find({ where: { projet: { id: projetId } }, order: { datePrevu: 'ASC' } });
  }

  async updateJalon(id: string, dto: Partial<CreateJalonDto>): Promise<Jalon> {
    const jalon = await this.jalonRepo.findOneBy({ id });
    if (!jalon) throw new NotFoundException(`Jalon "${id}" introuvable.`);
    Object.assign(jalon, dto);
    return this.jalonRepo.save(jalon);
  }
}
