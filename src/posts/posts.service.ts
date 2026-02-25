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

    // Add a tag to a post
    addTagToPost(id: number, tag: string): postInterface {
        const post = this.posts.find(post => post.id === id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        if (!post.tags) {
            post.tags = [];
        }
        post.tags.push(tag);
        return post;
    }

    // Remove a tag from a post
    removeTagFromPost(id: number, tag: string): postInterface {
        const post = this.posts.find(post => post.id === id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        if (!post.tags) {
            throw new NotFoundException(`No tags found for post with id ${id}`);
        }
        post.tags = post.tags.filter(t => t !== tag);
        return post;
    }

    // Add a comment to a post
    addCommentToPost(id: number, comment: { user: string; text: string; date?: Date }): postInterface {
        const post = this.posts.find(post => post.id === id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        if (!post.comments) {
            post.comments = [];
        }
        post.comments.push({ ...comment, date: comment.date || new Date() });
        return post;
    }

    // Remove a comment from a post by index
    removeCommentFromPost(id: number, index: number): postInterface {
        const post = this.posts.find(post => post.id === id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        if (!post.comments || index < 0 || index >= post.comments.length) {
            throw new NotFoundException(`Comment not found for post with id ${id}`);
        }
        post.comments.splice(index, 1);
        return post;
    }
    // Update metadata for a post
    updateMetadata(id: number, metadata: { views?: number; likes?: number }): postInterface {
        const post = this.posts.find(post => post.id === id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        if (!post.metadata) {
            post.metadata = { views: 0, likes: 0 };
        }
        post.metadata = { ...post.metadata, ...metadata };
        return post;
    }
}
