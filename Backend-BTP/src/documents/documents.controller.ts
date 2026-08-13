import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Post('projets/:projetId/documents')
  create(@Param('projetId') projetId: string, @Body() dto: any) { return this.service.create(projetId, dto); }

  @Get('projets/:projetId/documents')
  findAll(@Param('projetId') projetId: string) { return this.service.findAll(projetId); }

  @Get('documents/expirations')
  findExpiring() { return this.service.findExpiring(); }
}
