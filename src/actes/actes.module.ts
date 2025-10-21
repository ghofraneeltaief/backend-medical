import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActesEntity } from './actes.entity';
import { ActesService } from './actes.service';
import { ActesController } from './actes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActesEntity])],
  providers: [ActesService],
  controllers: [ActesController],
})
export class ActesModule {}
