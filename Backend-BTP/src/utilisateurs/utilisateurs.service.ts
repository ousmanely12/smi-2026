import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from './entities/utilisateur.entity';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';

@Injectable()
export class UtilisateursService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async create(dto: CreateUtilisateurDto): Promise<Partial<Utilisateur>> {
    const existant = await this.utilisateurRepository.findOneBy({ email: dto.email });
    if (existant) {
      throw new ConflictException(`Un utilisateur avec l'email "${dto.email}" existe déjà.`);
    }
    const utilisateur = this.utilisateurRepository.create(dto);
    const saved = await this.utilisateurRepository.save(utilisateur);
    const { motDePasse: _pwd, ...result } = saved as any;
    return result;
  }

  async findAll(): Promise<Utilisateur[]> {
    return this.utilisateurRepository.find({
      select: { id: true, nom: true, prenom: true, email: true, role: true, actif: true, telephone: true, poste: true, creeLe: true },
    });
  }

  async findOneById(id: string): Promise<Utilisateur> {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id },
      select: { id: true, nom: true, prenom: true, email: true, role: true, actif: true, telephone: true, poste: true, creeLe: true },
    });
    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur "${id}" introuvable.`);
    }
    return utilisateur;
  }

  // Utilisé par AuthService — inclut le mot de passe hashé
  async findByEmailAvecMotDePasse(email: string): Promise<Utilisateur | null> {
    return this.utilisateurRepository
      .createQueryBuilder('u')
      .addSelect('u.motDePasse')
      .where('u.email = :email', { email })
      .andWhere('u.actif = true')
      .getOne();
  }

  async desactiver(id: string): Promise<void> {
    await this.findOneById(id);
    await this.utilisateurRepository.update(id, { actif: false });
  }
}
