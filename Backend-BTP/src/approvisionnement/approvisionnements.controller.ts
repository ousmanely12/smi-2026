import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApprovisionnementsService } from './approvisionnements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class ApprovisionnementsController {
  constructor(private readonly service: ApprovisionnementsService) {}

  @Post('fournisseurs') createFournisseur(@Body() dto: any) { return this.service.createFournisseur(dto); }
  @Get('fournisseurs') findFournisseurs() { return this.service.findAllFournisseurs(); }

  @Post('projets/:projetId/bons-commande') createBC(@Param('projetId') id: string, @Body() dto: any) { return this.service.createBonCommande(id, dto); }
  @Get('projets/:projetId/bons-commande') getBCs(@Param('projetId') id: string) { return this.service.getBonsCommande(id); }

  @Post('projets/:projetId/stock') createMouvement(@Param('projetId') id: string, @Body() dto: any) { return this.service.createMouvement(id, dto); }
  @Get('projets/:projetId/stock') getStock(@Param('projetId') id: string) { return this.service.getStockChantier(id); }
  @Get('projets/:projetId/stock/mouvements') getMouvements(@Param('projetId') id: string) { return this.service.getMouvements(id); }
}
