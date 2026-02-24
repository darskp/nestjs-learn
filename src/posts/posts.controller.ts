import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
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

    // example of updating an existing post using PUT method
    @Put(':id')
    @HttpCode(HttpStatus.OK) // Set the HTTP status code to 200 OK
    updatedPost(@Body() updatedPostData: Partial<Omit<postInterface, 'id' | 'createdAt'>>, @Param('id', ParseIntPipe) id: number): postInterface {
        return this.postService.updatePost(id, updatedPostData);
    }

    // example of deleting a post using DELETE method
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Set the HTTP status code to 204 No Content
    deletePost(@Param('id', ParseIntPipe) id: number): String {
        return this.postService.deletePost(id);
    }



}
