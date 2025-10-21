import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RendezVousEntity } from './rendez-vous.entity';
import { RendezVousService } from './rendez-vous.service';
import { RendezVousController } from './rendez-vous.controller';
import { ActesEntity } from '../actes/actes.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RendezVousEntity, ActesEntity, User])],
  providers: [RendezVousService],
  controllers: [RendezVousController],
})
export class RendezVousModule {}
