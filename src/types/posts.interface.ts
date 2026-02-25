interface postInterface{
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt?: Date;
    updatedAt?: Date;
    tags?: string[]; // Array of tags
    comments?: Array<{
        user: string;
        text: string;
        date: Date;
    }>;
    metadata?: {
        views: number;
        likes: number;
    };
    attachments?: string[]; // Array of file URLs
}

export default postInterface;