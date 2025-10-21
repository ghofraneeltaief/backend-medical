import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // ✅ Autoriser le front à consommer l'API
  app.enableCors({
    origin: 'http://localhost:3000', // ton front
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();