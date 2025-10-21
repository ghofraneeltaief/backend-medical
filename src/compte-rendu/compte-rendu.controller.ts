import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CompteRenduService } from './compte-rendu.service';
import { CompteRenduEntity } from './compte-rendu.entity';

@Controller('compterendu')
export class CompteRenduController {
  constructor(private readonly crService: CompteRenduService) {}

  @Post()
  create(@Body() body: { id_rv: number; id_medecin: number; id_acte: number; nom_patient: string; contenu: string }) {
    return this.crService.create(body);
  }

  @Get()
  findAll(): Promise<CompteRenduEntity[]> {
    return this.crService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<CompteRenduEntity> {
    return this.crService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<CompteRenduEntity>): Promise<CompteRenduEntity> {
    return this.crService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.crService.delete(id);
  }
}
