import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 👈 très important
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // utile si AuthModule a besoin de UsersService
})
export class UsersModule {}
