import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ActesModule } from './actes/actes.module';
import { RendezVousModule } from './rendez-vous/rendez-vous.module';
import { CompteRenduModule } from './compte-rendu/compte-rendu.module';
import { ImagerieMedicaleModule } from './imagerie-medicale/imagerie-medicale.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // accessible partout sans réimporter
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'projet_university',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ActesModule,
    RendezVousModule,
    CompteRenduModule,
    ImagerieMedicaleModule,
  ],
})
export class AppModule {}
