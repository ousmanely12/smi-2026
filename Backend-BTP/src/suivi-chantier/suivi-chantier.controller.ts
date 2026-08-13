import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SuiviChantierService } from './suivi-chantier.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projets/:projetId')
@UseGuards(JwtAuthGuard)
export class SuiviChantierController {
  constructor(private readonly service: SuiviChantierService) {}

  @Post('journaux') createJournal(@Param('projetId') id: string, @Body() dto: any) { return this.service.createJournal(id, dto); }
  @Get('journaux') getJournaux(@Param('projetId') id: string) { return this.service.getJournaux(id); }
  @Post('incidents') createIncident(@Param('projetId') id: string, @Body() dto: any) { return this.service.createIncident(id, dto); }
  @Get('incidents') getIncidents(@Param('projetId') id: string) { return this.service.getIncidents(id); }
}
