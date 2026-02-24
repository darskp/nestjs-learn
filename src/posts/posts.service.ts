import { Injectable, NotFoundException } from '@nestjs/common';
import postInterface from 'src/types/posts.interface';

@Injectable()
export class PostsService {
    private posts: postInterface[] = [
        {
            id: 1, title: 'First Post',
            content: 'This is the first post',
            author: 'John Doe',
            // createdAt: 2026-02-24T12:17:53.046Z"
        },
        {
            id: 2, title: 'Second Post',
            content: 'This is the second post',
            author: 'Jane Doe',
            // createdAt: "2026-02-24T12:17:53.046Z"

        },
    ];

    findAllPosts(): postInterface[] {
        return this.posts;
    }

    findPostById(id: number): postInterface {
        const post = this.posts.find(post => post.id === id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return post;
    }

    private getNextId(): number {
        return this.posts.length > 0 ? Math.max(...this.posts.map(post => post.id)) + 1 : 1;
    }

    createPost(createPostData: Omit<postInterface, 'id' | 'createdAt'>) {
        const newPost: postInterface = {
            id: this.getNextId(),
            title: createPostData.title,
            content: createPostData.content,
            author: createPostData.author,
            createdAt: new Date()
        };
        this.posts.push(newPost);
        return newPost;
    }

    updatePost(id: number, updatePostData: Partial<Omit<postInterface, 'id' | 'createdAt'>>): postInterface {
        const post = this.posts.findIndex(post => post.id === id);
        if (post === -1) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        const updatedPost = { ...this.posts[post], ...updatePostData, updatedAt: new Date(), };
        this.posts[post] = updatedPost;
        return updatedPost;
    }

    deletePost(id: number): String {
        const postIndex = this.posts.findIndex(post => post.id === id);
        if (postIndex === -1) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        this.posts.splice(postIndex, 1);
        return `Post with id ${id} has been deleted successfully`;
    }
}
