import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   const logger = new Logger('Bootstrap');

   const config = app.get(ConfigService);
   const frontendUrl = config.get('api.config.appUrl') as string;
   const apiUrl = config.get('api.config.apiUrl') as string;

   app.setGlobalPrefix('api');
   app.enableCors({ origin: frontendUrl, credentials: true });
   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         transform: true,
         forbidNonWhitelisted: true,
      }),
   );

   const port = process.env.PORT ?? 3333;
   await app.listen(port);

   logger.log(`Application is running on: ${apiUrl}`);
}

bootstrap().catch((error) => {
   const logger = new Logger('Bootstrap');
   logger.error('Error starting application:', error);
   process.exit(1);
});
