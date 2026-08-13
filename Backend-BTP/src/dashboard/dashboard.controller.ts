import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboardGlobal() { return this.dashboardService.getDashboardGlobal(); }

  @Get('projets/:projetId')
  getDashboardProjet(@Param('projetId') projetId: string) {
    return this.dashboardService.getDashboardProjet(projetId);
  }
}
