import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ActesEntity } from '../actes/actes.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActesEntity, User])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

