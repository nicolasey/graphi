import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestEnlighten } from 'nestjs-enlighten';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new NestEnlighten({ theme: 'theme-dark' }));
  await app.listen(3000);
}
bootstrap();
