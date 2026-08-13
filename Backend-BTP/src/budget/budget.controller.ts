import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateLigneDevisDto } from './dto/create-ligne-devis.dto';
import { CreateDepenseDto } from './dto/create-depense.dto';
import { CreateAvenantDto } from './dto/create-avenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjetsService } from '../projets/projets.service';

@Controller('projets/:projetId')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly projetsService: ProjetsService,
  ) {}

  // ─── DEVIS ──────────────────────────────────────────────────────────────
  @Post('devis')
  addLigneDevis(@Param('projetId') projetId: string, @Body() dto: CreateLigneDevisDto) {
    return this.budgetService.addLigneDevis(projetId, dto);
  }

  @Get('devis')
  getDevis(@Param('projetId') projetId: string) {
    return this.budgetService.getDevis(projetId);
  }

  // ─── DÉPENSES ───────────────────────────────────────────────────────────
  @Post('depenses')
  addDepense(@Param('projetId') projetId: string, @Body() dto: CreateDepenseDto) {
    return this.budgetService.addDepense(projetId, dto);
  }

  @Get('depenses')
  getDepenses(@Param('projetId') projetId: string) {
    return this.budgetService.getDepenses(projetId);
  }

  // ─── AVENANTS ───────────────────────────────────────────────────────────
  @Post('avenants')
  addAvenant(@Param('projetId') projetId: string, @Body() dto: CreateAvenantDto) {
    return this.budgetService.addAvenant(projetId, dto);
  }

  @Get('avenants')
  getAvenants(@Param('projetId') projetId: string) {
    return this.budgetService.getAvenants(projetId);
  }

  // ─── KPIs BUDGÉTAIRES ───────────────────────────────────────────────────
  @Get('budget')
  async getBudget(@Param('projetId') projetId: string) {
    const projet = await this.projetsService.findOne(projetId);
    return this.budgetService.getKpiBudget(projetId, Number(projet.montantMarche));
  }
}
