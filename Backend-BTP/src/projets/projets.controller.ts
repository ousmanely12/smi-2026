import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ProjetsService } from './projets.service';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { RessourcesService } from '../ressources/ressources.service';

@Controller('projets')
export class ProjetsController {
    constructor(
        private readonly projetsService: ProjetsService,
        private readonly ressourcesService: RessourcesService,
    ) { }

    @Post()
    create(@Body() createProjetDto: CreateProjetDto) {
        return this.projetsService.create(createProjetDto);
    }

    @Get()
    findAll() {
        return this.projetsService.findAll();
    }

    // ─── Ressources du projet ───────────────────────────────────────────────
    @Get(':id/personnel')
    getPersonnelProjet(@Param('id') id: string) {
        return this.ressourcesService.getPersonnelProjet(id);
    }

    @Get(':id/engins')
    getEnginsProjet(@Param('id') id: string) {
        return this.ressourcesService.getEnginsProjet(id);
    }

    @Post(':id/engins')
    affecterEngin(@Param('id') id: string, @Body() dto: any) {
        return this.ressourcesService.affecterEngin({ ...dto, projetId: id });
    }

    @Get(':id/sous-traitants')
    getSousTraitantsProjet(@Param('id') id: string) {
        return this.ressourcesService.getSousTraitantsProjet(id);
    }

    @Post(':id/sous-traitants')
    affecterSousTraitant(@Param('id') id: string, @Body() dto: any) {
        return this.ressourcesService.affecterSousTraitant({ ...dto, projetId: id });
    }

    @Get(':id/pointages')
    getPointages(@Param('id') id: string) {
        return this.ressourcesService.getPointagesProjet(id);
    }

    @Post(':id/pointages')
    createPointage(@Param('id') id: string, @Body() dto: any) {
        return this.ressourcesService.createPointage({ ...dto, projetId: id });
    }

    // ─── CRUD de base (DOIT être après les sous-routes) ────────────────────
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projetsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProjetDto: UpdateProjetDto) {
        return this.projetsService.update(id, updateProjetDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.projetsService.remove(id);
    }
}