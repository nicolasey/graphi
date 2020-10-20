import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestEnlighten } from 'nestjs-enlighten';
import * as helmet from "helmet";
import * as rateLimit from "express-rate-limit";
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(helmet());
  //app.enableCors();
  app.use(
    rateLimit({
      windowMs: process.env.RATE_LIMIT_MS,
      max: process.env.RATE_LIMIT_NB,
    })
  );
  app.useGlobalFilters(new NestEnlighten({ theme: 'theme-dark' }));
  await app.listen(3000);
}
bootstrap();
