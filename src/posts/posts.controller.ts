import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import type postInterface from 'src/types/posts.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistsPipe } from './customPipes/postExists.pipe';

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
    getpostById(@Param('id', ParseIntPipe,PostExistsPipe) id: number): postInterface {
        return this.postService.findPostById(id);
    }

    // example of creating a new post using POST method
    @Post()
    // @HttpCode(HttpStatus.CREATED) // Set the HTTP status code to 201 Created
    @HttpCode(HttpStatus.CREATED)
    //option 1: use global validation pipe in main.ts file
    // option 2: use local validation pipe for this specific route

    //✔ Pipes stack
    // ✔ Global runs first
    // ✔ Local runs after
    // ✔ They don’t override
    // ✔ First pipe that throws error stops execution

    @UsePipes(
        new ValidationPipe({
           //add new options here if needed but it shouldn't be same as global options in main.ts file (to avoid confusion and conflicts)
        }))
    createPost(@Body() createPostData: CreatePostDto): postInterface {
        return this.postService.createPost(createPostData);
    }

    // example of updating an existing post using PUT method
    @Put(':id')
    @HttpCode(HttpStatus.OK) // Set the HTTP status code to 200 OK
    updatedPost(@Body() updatedPostData: UpdatePostDto, @Param('id', ParseIntPipe,PostExistsPipe) id: number): postInterface {
        return this.postService.updatePost(id, updatedPostData);
    }

    // example of deleting a post using DELETE method
    @Delete(':id')
    @HttpCode(HttpStatus.OK) // Set the HTTP status code to 204 No Content
    deletePost(@Param('id', ParseIntPipe,PostExistsPipe) id: number): String {
        return this.postService.deletePost(id);
    }



}
