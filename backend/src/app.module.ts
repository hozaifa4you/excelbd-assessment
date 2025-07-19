import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ParcelModule } from './parcel/parcel.module';
import { ConfigModule } from '@nestjs/config';
import { UploaderModule } from './uploader/uploader.module';
import appConfig from './config/app.config';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         expandVariables: true,
         load: [appConfig],
      }),
      PrismaModule,
      AuthModule,
      UserModule,
      ParcelModule,
      UploaderModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
