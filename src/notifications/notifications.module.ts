import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './notifications.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, User])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService], // Export pour utilisation dans d'autres modules
})
export class NotificationsModule {}
