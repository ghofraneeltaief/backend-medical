import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ActesService } from './actes.service';
import { ActesEntity } from './actes.entity';

@Controller('actes')
export class ActesController {
  constructor(private readonly actesService: ActesService) {}

  @Post()
  create(@Body() body: Partial<ActesEntity>): Promise<ActesEntity> {
    return this.actesService.create(body);
  }

  @Get()
  findAll(): Promise<ActesEntity[]> {
    return this.actesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<ActesEntity> {
    return this.actesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<ActesEntity>): Promise<ActesEntity> {
    return this.actesService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.actesService.delete(id);
  }
}
