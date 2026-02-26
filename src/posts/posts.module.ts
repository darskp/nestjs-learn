import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostExistsPipe } from './customPipes/postExists.pipe';

@Module({
    imports: [
        //available for dependency injection in the service and controller
        TypeOrmModule.forFeature([Post])
    ],
    controllers: [PostsController],
    providers: [PostsService, PostExistsPipe],
    exports: [PostsService, PostExistsPipe],
})
export class PostsModule {

}
