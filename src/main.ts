import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from "express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⚡ Servir le dossier uploads en statique correctement
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // ✅ Autoriser le front à consommer l'API 
  app.enableCors({
    origin: 'http://localhost:3000', // ton front
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
