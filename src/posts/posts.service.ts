import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    // private posts: postInterface[] = [
    //     {
    //         id: 1, title: 'First Post',
    //         content: 'This is the first post',
    //         author: 'John Doe',
    //         // createdAt: 2026-02-24T12:17:53.046Z"
    //     },
    //     {
    //         id: 2, title: 'Second Post',
    //         content: 'This is the second post',
    //         author: 'Jane Doe',
    //         // createdAt: "2026-02-24T12:17:53.046Z"

    //     },
    // ];

    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>
    ) { }

    async findAllPosts(): Promise<Post[]> {
        return this.postsRepository.find();
    }

    async findPostsByTitle(title: string): Promise<Post[]> {
        return this.postsRepository.find({
            where: {
                title: title
            }
        });
    }

    async findPostById(id: number): Promise<Post> {
        const post = await this.postsRepository.findOneBy({ id });
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return post;
    }

    async createPost(createPostData: CreatePostDto): Promise<Post> {
        const newPost = this.postsRepository.create({
            title: createPostData.title,
            content: createPostData.content,
            author: createPostData.author,
            tags: createPostData.tags ?? [],
            comments: createPostData.comments ?? [],
            metadata: createPostData.metadata ?? { views: 0, likes: 0 },
        });
        await this.postsRepository.save(newPost);
        return newPost;
    }

    async updatePost(id: number, updatePostData: UpdatePostDto): Promise<Post> {
        const findPostToUpdate = await this.findPostById(id);
        if (!findPostToUpdate) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        const updatedPost = this.postsRepository.merge(findPostToUpdate, updatePostData);
        await this.postsRepository.save(updatedPost);
        return updatedPost;

    }

    async deletePost(id: number): Promise<string> {
        const findPostToDelete = await this.findPostById(id);
        if (!findPostToDelete) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        const deleteResult = await this.postsRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return `Post with id ${id} has been deleted successfully`;
    }

    // Add a tag to a post
    async addTagToPost(id: number, tag: string): Promise<Post> {
        const findPostToAddTag = await this.findPostById(id);
        if (!findPostToAddTag) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        if (!findPostToAddTag.tags) {
            findPostToAddTag.tags = [];
        }
        findPostToAddTag.tags.push(tag);
        await this.postsRepository.save(findPostToAddTag);
        return findPostToAddTag;
    }

    // Remove a tag from a post
    async removeTagFromPost(id: number, tag: string): Promise<Post> {
        const removeTagFromPost = await this.findPostById(id);
        if (!removeTagFromPost) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        if (!removeTagFromPost.tags) {
            throw new NotFoundException(`No tags found for post with id ${id}`);
        }
        removeTagFromPost.tags = removeTagFromPost.tags.filter(t => t !== tag);
        await this.postsRepository.save(removeTagFromPost);
        return removeTagFromPost;
    }

    // Add a comment to a post
    async addCommentToPost(id: number, comment: { user: string; text: string; date?: Date }): Promise<Post> {
        const post = await this.findPostById(id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        if (!post.comments) {
            post.comments = [];
        }
        post.comments.push({
            user: comment.user,
            text: comment.text,
            date: comment.date ?? new Date(),
        });
        await this.postsRepository.save(post);
        return post;
    }

    // Remove a comment from a post by index
    async removeCommentFromPost(id: number, index: number): Promise<Post> {
        const post = await this.findPostById(id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        if (!post.comments || index < 0 || index >= post.comments.length) {
            throw new NotFoundException(`Comment at index ${index} not found for post with id ${id}`);
        }
        post.comments.splice(index, 1);
        await this.postsRepository.save(post);
        return post;
    }
    // Update metadata for a post
    async updateMetadata(id: number, metadata: { views?: number; likes?: number }): Promise<Post> {
        const post = await this.findPostById(id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        post.metadata = {
            views: metadata.views ?? post.metadata?.views ?? 0,
            likes: metadata.likes ?? post.metadata?.likes ?? 0,
        };
        await this.postsRepository.save(post);
        return post;
    }
}
