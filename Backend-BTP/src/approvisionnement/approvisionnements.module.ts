import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fournisseur } from './entities/fournisseur.entity';
import { BonCommande } from './entities/bon-commande.entity';
import { MouvementStock } from './entities/mouvement-stock.entity';
import { ApprovisionnementsService } from './approvisionnements.service';
import { ApprovisionnementsController } from './approvisionnements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Fournisseur, BonCommande, MouvementStock])],
  controllers: [ApprovisionnementsController],
  providers: [ApprovisionnementsService],
  exports: [ApprovisionnementsService],
})
export class ApprovisionnementsModule {}
