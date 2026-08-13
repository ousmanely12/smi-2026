import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projet } from './entities/projet.entity';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';

// Code d'erreur PostgreSQL pour violation de contrainte unique
const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class ProjetsService {
  constructor(
    @InjectRepository(Projet)
    private readonly projetRepository: Repository<Projet>,
  ) {}

  async create(createProjetDto: CreateProjetDto): Promise<Projet> {
    try {
      const projet = this.projetRepository.create(createProjetDto);
      return await this.projetRepository.save(projet);
    } catch (err) {
      if (err.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException(
          `Un projet avec la référence "${createProjetDto.reference}" existe déjà.`,
        );
      }
      throw err;
    }
  }

  findAll(): Promise<Projet[]> {
    return this.projetRepository.find();
  }

  async findOne(id: string): Promise<Projet> {
    const projet = await this.projetRepository.findOneBy({ id });
    if (!projet) {
      throw new NotFoundException(`Projet avec l'ID "${id}" introuvable.`);
    }
    return projet;
  }

  async update(id: string, updateProjetDto: UpdateProjetDto): Promise<Projet> {
    await this.findOne(id); // vérifie existence → lève 404 si absent
    try {
      await this.projetRepository.update(id, updateProjetDto);
      return this.projetRepository.findOneByOrFail({ id });
    } catch (err) {
      if (err.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException(
          `Un projet avec cette référence existe déjà.`,
        );
      }
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // vérifie existence → lève 404 si absent
    await this.projetRepository.delete(id);
  }
}