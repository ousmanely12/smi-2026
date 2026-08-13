import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ProjetsService } from './projets.service';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';

@Controller('projets')
export class ProjetsController {
    constructor(private readonly projetsService: ProjetsService) { }

    @Post()
    create(@Body() createProjetDto: CreateProjetDto) {
        return this.projetsService.create(createProjetDto);
    }

    @Get()
    findAll() {
        return this.projetsService.findAll();
    }

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