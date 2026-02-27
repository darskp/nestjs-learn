// example
// export class CreateUserDto {
//   @IsString()
//   name: string;

//   @IsInt()
//   age: number;
// }


import { IsNotEmpty, IsString, MaxLength, MinLength, IsOptional } from "class-validator";


export class CreatePostDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 charaters long' })
  @MaxLength(50, { message: 'Title can not be longer than 50 charaters' })
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(5, { message: 'Content must be at least 3 charaters long' })
  content: string;

  @IsNotEmpty({ message: 'Author is required' })
  @IsString({ message: 'Author must be a string' })
  @MinLength(2, { message: 'Author must be at least 2 charaters long' })
  @MaxLength(25, { message: 'Title can not be longer than 25 charaters' })
  author: string;

  @IsOptional()
  tags?: string[];

  @IsOptional()
  comments?: Array<{
    user: string;
    text: string;
    date: Date;
  }>;

  @IsOptional()
  metadata?: {
    views: number;
    likes: number;
  };

  @IsOptional()
  attachments?: string[];
}
