import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import type postInterface from 'src/types/posts.interface';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) { }

    @Get('')
    getAllPosts(@Query('title') title: String): postInterface[] {
        const allPosts = this.postService.findAllPosts();
        if (title) {
            return allPosts.filter(post => post.title.toLowerCase().includes(title.toLowerCase()));
        } else {
            return allPosts;
        }
    }

    @Get(':id')
    getpostById(@Param('id', ParseIntPipe) id: number): postInterface {
        return this.postService.findPostById(id);
    }

    // example of creating a new post using POST method
    @Post()
    // @HttpCode(HttpStatus.CREATED) // Set the HTTP status code to 201 Created
    @HttpCode(HttpStatus.CREATED)
    createPost(@Body() createPostData: Omit<postInterface, 'id' | 'createdAt'>): postInterface {
        return this.postService.createPost(createPostData);
    }


}
