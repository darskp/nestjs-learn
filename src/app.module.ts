import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
// import *as joi from 'joi';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema:joi.object({
      //   APP_NAME: joi.string().default('NestJS'),
      // })
      load: [appConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Post,User],
        synchronize: true,
      }),
    }),
 PostsModule, AuthModule
  ],
  controllers: [AppController, PostsController],
  providers: [AppService],
})
export class AppModule { }
