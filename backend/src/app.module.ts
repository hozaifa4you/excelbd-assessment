import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ParcelModule } from './parcel/parcel.module';
import { ConfigModule } from '@nestjs/config';
import { UploaderModule } from './uploader/uploader.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AdminModule } from './admin/admin.module';
import appConfig from './config/app.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         expandVariables: true,
         load: [appConfig],
      }),
      MailerModule.forRootAsync({
         imports: [ConfigModule],
         useFactory: (configService: ConfigService) => ({
            transport: {
               host: configService.get<string>('MAIL_HOST') ?? 'smtp.gmail.com',
               port: configService.get<number>('MAIL_PORT') ?? 587,
               secure: configService.get<string>('MAIL_SECURE') === 'true',
               auth: {
                  user: configService.get<string>('MAIL_USER'),
                  pass: configService.get<string>('MAIL_PASS'),
               },
            },
            defaults: {
               from: `"${configService.get<string>('MAIL_FROM_NAME') ?? 'Quicko'}" <${configService.get<string>('MAIL_FROM') ?? configService.get<string>('MAIL_USER')}>`,
            },
            template: {
               dir: process.cwd() + '/src/templates',
               adapter: new HandlebarsAdapter(),
               options: {
                  strict: true,
               },
            },
         }),
         inject: [ConfigService],
      }),
      PrismaModule,
      AuthModule,
      UserModule,
      ParcelModule,
      UploaderModule,
      AnalyticsModule,
      AdminModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
