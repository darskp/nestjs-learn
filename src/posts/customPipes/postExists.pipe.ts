
import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { PostsService } from '../posts.service';

@Injectable()
export class PostExistsPipe implements PipeTransform {
    constructor(private readonly postsServices: PostsService) { }
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            this.postsServices.findPostById(value);
        } catch (error) {
            throw new NotFoundException(`Post with id ${value} not found`);
        }
        return value;
    }
}
