import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FacturationService } from './facturation.service';
import { ProjetsService } from '../projets/projets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projets/:projetId')
@UseGuards(JwtAuthGuard)
export class FacturationController {
  constructor(
    private readonly facturationService: FacturationService,
    private readonly projetsService: ProjetsService,
  ) {}

  @Post('situations')
  async createSituation(@Param('projetId') projetId: string, @Body() dto: any) {
    const projet = await this.projetsService.findOne(projetId);
    return this.facturationService.createSituation(projetId, dto, Number(projet.montantMarche));
  }

  @Get('situations')
  getSituations(@Param('projetId') projetId: string) {
    return this.facturationService.getSituations(projetId);
  }

  @Get('situations/recapitulatif')
  getRecap(@Param('projetId') projetId: string) {
    return this.facturationService.getRecapitulatif(projetId);
  }
}
