import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
//entity means table in database
//post is the name of the table in database
export class Post {
    @PrimaryGeneratedColumn()
    // PrimaryGeneratedColumn is a decorator that is used to generate a primary key for the table
    id: number;

    @Column({length: 500, nullable: false,type:'varchar', })
    title: string;

    @Column({length: 1000, nullable: false,type:'varchar', })
    content: string;

    @ManyToOne(() => User, user => user.posts)
    author: User;

    @CreateDateColumn({nullable:true, type:'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @UpdateDateColumn({nullable:true, type:'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
    
    @Column({ type: 'simple-array', nullable: true })
    tags?: string[];

    @Column({
        type: 'json',
        nullable: true
    })
    comments?: Array<{
        user: string;
        text: string;
        date: Date;
    }>;

    @Column({
        type: 'json',
        nullable: true
    })
    metadata?: {
        views: number;
        likes: number;
    };

    @Column({ type: 'simple-array', nullable: true })
    attachments?: string[];
    



}