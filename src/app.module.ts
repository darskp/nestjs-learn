import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
// import *as joi from 'joi';
import appConfig from './config/app.config';

@Module({
  imports: [HelloModule, UserModule, OrderModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema:joi.object({
      //   APP_NAME: joi.string().default('NestJS'),
      // })
load:[appConfig]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
