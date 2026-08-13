import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RessourcesService } from './ressources.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class RessourcesController {
  constructor(private readonly ressourcesService: RessourcesService) {}

  // ─── PERSONNEL ────────────────────────────────────────────────────────
  @Post('personnel') createPersonnel(@Body() dto: any) { return this.ressourcesService.createPersonnel(dto); }
  @Get('personnel') findAllPersonnel() { return this.ressourcesService.findAllPersonnel(); }
  @Get('personnel/:id') findPersonnel(@Param('id') id: string) { return this.ressourcesService.findPersonnel(id); }
  @Patch('personnel/:id') updatePersonnel(@Param('id') id: string, @Body() dto: any) { return this.ressourcesService.updatePersonnel(id, dto); }

  // ─── POINTAGE ─────────────────────────────────────────────────────────
  @Post('projets/:projetId/pointages')
  createPointage(@Param('projetId') projetId: string, @Body() dto: any) {
    return this.ressourcesService.createPointage({ ...dto, projetId });
  }

  @Get('projets/:projetId/pointages')
  getPointages(@Param('projetId') projetId: string) {
    return this.ressourcesService.getPointagesProjet(projetId);
  }

  @Get('projets/:projetId/masse-salariale')
  getMasseSalariale(
    @Param('projetId') projetId: string,
    @Query('debut') debut: string,
    @Query('fin') fin: string,
  ) {
    return this.ressourcesService.getMasseSalariale(projetId, debut, fin);
  }

  // ─── ENGINS ───────────────────────────────────────────────────────────
  @Post('engins') createEngin(@Body() dto: any) { return this.ressourcesService.createEngin(dto); }
  @Get('engins') findAllEngins() { return this.ressourcesService.findAllEngins(); }

  // ─── SOUS-TRAITANTS ───────────────────────────────────────────────────
  @Post('sous-traitants') createSousTraitant(@Body() dto: any) { return this.ressourcesService.createSousTraitant(dto); }
  @Get('sous-traitants') findAllSousTraitants() { return this.ressourcesService.findAllSousTraitants(); }
}
