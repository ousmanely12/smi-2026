import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(@InjectRepository(Document) private documentRepo: Repository<Document>) {}

  create(projetId: string, dto: Partial<Document>) {
    return this.documentRepo.save(this.documentRepo.create({ ...dto, projet: { id: projetId } as any }));
  }
  findAll(projetId: string) {
    return this.documentRepo.find({ where: { projet: { id: projetId } }, order: { creeLe: 'DESC' } });
  }
  findExpiring() {
    const inThirtyDays = new Date();
    inThirtyDays.setDate(inThirtyDays.getDate() + 30);
    return this.documentRepo
      .createQueryBuilder('d')
      .where('d.dateExpiration IS NOT NULL')
      .andWhere('d.dateExpiration <= :date', { date: inThirtyDays })
      .orderBy('d.dateExpiration', 'ASC')
      .getMany();
  }
}
