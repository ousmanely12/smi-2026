import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SituationTravaux } from './entities/situation-travaux.entity';
import { FacturationService } from './facturation.service';
import { FacturationController } from './facturation.controller';
import { ProjetsModule } from '../projets/projets.module';

@Module({
  imports: [TypeOrmModule.forFeature([SituationTravaux]), ProjetsModule],
  controllers: [FacturationController],
  providers: [FacturationService],
  exports: [FacturationService],
})
export class FacturationModule {}
