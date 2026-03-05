import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostExistsPipe } from './customPipes/postExists.pipe';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        //available for dependency injection in the service and controller
        TypeOrmModule.forFeature([Post]),
        AuthModule
    ],
    controllers: [PostsController],
    providers: [PostsService, PostExistsPipe],
    exports: [PostsService, PostExistsPipe],
})
export class PostsModule {

}
