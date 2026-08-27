import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Personnel } from './entities/personnel.entity';
import { Pointage } from './entities/pointage.entity';
import { Engin } from './entities/engin.entity';
import { SousTraitant } from './entities/sous-traitant.entity';
import { AffectationEngin } from './entities/affectation-engin.entity';
import { AffectationSousTraitant } from './entities/affectation-sous-traitant.entity';
import { RessourcesService } from './ressources.service';
import { RessourcesController } from './ressources.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Personnel, Pointage, Engin, SousTraitant,
    AffectationEngin, AffectationSousTraitant,
  ])],
  controllers: [RessourcesController],
  providers: [RessourcesService],
  exports: [RessourcesService],
})
export class RessourcesModule {}
