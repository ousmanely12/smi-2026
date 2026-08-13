import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalChantier } from './entities/journal-chantier.entity';
import { Incident } from './entities/incident.entity';

@Injectable()
export class SuiviChantierService {
  constructor(
    @InjectRepository(JournalChantier) private journalRepo: Repository<JournalChantier>,
    @InjectRepository(Incident) private incidentRepo: Repository<Incident>,
  ) {}

  createJournal(projetId: string, dto: Partial<JournalChantier>) {
    return this.journalRepo.save(this.journalRepo.create({ ...dto, projet: { id: projetId } as any }));
  }
  getJournaux(projetId: string) {
    return this.journalRepo.find({ where: { projet: { id: projetId } }, order: { date: 'DESC' } });
  }

  createIncident(projetId: string, dto: Partial<Incident>) {
    return this.incidentRepo.save(this.incidentRepo.create({ ...dto, projet: { id: projetId } as any }));
  }
  getIncidents(projetId: string) {
    return this.incidentRepo.find({ where: { projet: { id: projetId } }, order: { date: 'DESC' } });
  }
}
