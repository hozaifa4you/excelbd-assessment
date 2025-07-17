import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.setGlobalPrefix('api');
   app.enableCors({
      origin: process.env.APP_URL,
   });
   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         transform: true,
      }),
   );
   await app.listen(process.env.PORT ?? 3333);
}
bootstrap().catch(log);
