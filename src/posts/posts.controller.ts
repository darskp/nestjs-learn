import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistsPipe } from './customPipes/postExists.pipe';
import { Post as PostEntity } from './entities/post.entity';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) { }

    @Get('')
   async getAllPosts(@Query('title') title: string): Promise<PostEntity[]> {
        if (title) {
            return this.postService.findPostsByTitle(title);
        }
        return this.postService.findAllPosts();
    }

    @Get(':id')
    async getpostById(@Param('id', ParseIntPipe,PostExistsPipe) id: number): Promise<PostEntity> {
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
   async createPost(@Body() createPostData: CreatePostDto): Promise<PostEntity> {
        return this.postService.createPost(createPostData);
    }

    // example of updating an existing post using PUT method
    @Put(':id')
    @HttpCode(HttpStatus.OK) // Set the HTTP status code to 200 OK
   async updatedPost(@Body() updatedPostData: UpdatePostDto, @Param('id', ParseIntPipe,PostExistsPipe) id: number): Promise<PostEntity> {
        return this.postService.updatePost(id, updatedPostData);
    }

    // example of deleting a post using DELETE method
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
   async deletePost(@Param('id', ParseIntPipe, PostExistsPipe) id: number): Promise<string> {
        return this.postService.deletePost(id);
    }

    // Add a tag to a post
    @Post(':id/tags')
    @HttpCode(HttpStatus.OK)
   async addTag(
        @Param('id', ParseIntPipe, PostExistsPipe) id: number,
        @Body('tag') tag: string
    ): Promise<PostEntity> {
        return this.postService.addTagToPost(id, tag);
    }

    // Remove a tag from a post
    @Delete(':id/tags/:tag')
    @HttpCode(HttpStatus.OK)
   async removeTag(
        @Param('id', ParseIntPipe, PostExistsPipe) id: number,
        @Param('tag') tag: string
    ): Promise<PostEntity> {
        return this.postService.removeTagFromPost(id, tag);
    }

    // Add a comment to a post
    @Post(':id/comments')
    @HttpCode(HttpStatus.OK)
   async addComment(
        @Param('id', ParseIntPipe, PostExistsPipe) id: number,
        @Body() comment: { user: string; text: string; date?: Date }
    ): Promise<PostEntity> {
        return this.postService.addCommentToPost(id, comment);
    }

    // Remove a comment from a post by index
    @Delete(':id/comments/:index')
    @HttpCode(HttpStatus.OK)
   async removeComment(
        @Param('id', ParseIntPipe, PostExistsPipe) id: number,
        @Param('index') index: number
    ): Promise<PostEntity> {
        return this.postService.removeCommentFromPost(id, index);
    }

    // Update metadata for a post
    @Put(':id/metadata')
    @HttpCode(HttpStatus.OK)
   async updateMetadata(
        @Param('id', ParseIntPipe, PostExistsPipe) id: number,
        @Body() metadata: { views?: number; likes?: number }
    ): Promise<PostEntity> {
        return this.postService.updateMetadata(id, metadata);
    }
}
