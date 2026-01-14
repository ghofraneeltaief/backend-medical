import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FacturesService } from './factures.service';
import { FactureEntity } from './factures.entity';

@Controller('factures')
export class FacturesController {
  constructor(private readonly facturesService: FacturesService) {}

  @Post()
  create(@Body() body: {
    id_rendez_vous: number;
    id_acte: number;
    nom_patient: string;
    montant: number;
    date_facture: string;
    statut?: string;
  }): Promise<FactureEntity> {
    return this.facturesService.create(body);
  }

  @Get()
  findAll(): Promise<FactureEntity[]> {
    return this.facturesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<FactureEntity> {
    return this.facturesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<FactureEntity> & { id_acte?: number; id_rendez_vous?: number }): Promise<FactureEntity> {
    return this.facturesService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.facturesService.delete(id);
  }
}
