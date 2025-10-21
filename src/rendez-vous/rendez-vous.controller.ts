import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RendezVousService } from './rendez-vous.service';
import { RendezVousEntity } from './rendez-vous.entity';

@Controller('rendezvous')
export class RendezVousController {
  constructor(private readonly rvService: RendezVousService) {}

  @Post()
  create(@Body() body: { id_acte: number; id_medecin: number; nom_patient: string; date: string; heure: string }) {
    return this.rvService.create(body);
  }

  @Get()
  findAll(): Promise<RendezVousEntity[]> {
    return this.rvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<RendezVousEntity> {
    return this.rvService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<RendezVousEntity>): Promise<RendezVousEntity> {
    return this.rvService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.rvService.delete(id);
  }
}
