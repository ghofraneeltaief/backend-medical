import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompteRenduEntity } from './compte-rendu.entity';
import { CompteRenduService } from './compte-rendu.service';
import { CompteRenduController } from './compte-rendu.controller';
import { RendezVousEntity } from '../rendez-vous/rendez-vous.entity';
import { ActesEntity } from '../actes/actes.entity';
import { User } from '../auth/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompteRenduEntity, RendezVousEntity, ActesEntity, User]),
    NotificationsModule,
  ],
  providers: [CompteRenduService],
  controllers: [CompteRenduController],
})
export class CompteRenduModule {}
