import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturesController } from './factures.controller';
import { FacturesService } from './factures.service';
import { FactureEntity } from './factures.entity';
import { RendezVousEntity } from '../rendez-vous/rendez-vous.entity';
import { ActesEntity } from '../actes/actes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FactureEntity, RendezVousEntity, ActesEntity]),
  ],
  controllers: [FacturesController],
  providers: [FacturesService],
  exports: [FacturesService],
})
export class FacturesModule {}
