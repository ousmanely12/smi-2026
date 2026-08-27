import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetsService } from './projets.service';
import { ProjetsController } from './projets.controller';
import { Projet } from './entities/projet.entity';
import { RessourcesModule } from '../ressources/ressources.module';

@Module({
  imports: [TypeOrmModule.forFeature([Projet]), RessourcesModule],
  controllers: [ProjetsController],
  providers: [ProjetsService],
  exports: [ProjetsService],
})
export class ProjetsModule { }