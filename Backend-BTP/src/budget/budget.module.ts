import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigneDevis } from './entities/ligne-devis.entity';
import { Depense } from './entities/depense.entity';
import { Avenant } from './entities/avenant.entity';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { ProjetsModule } from '../projets/projets.module';

@Module({
  imports: [TypeOrmModule.forFeature([LigneDevis, Depense, Avenant]), ProjetsModule],
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}
