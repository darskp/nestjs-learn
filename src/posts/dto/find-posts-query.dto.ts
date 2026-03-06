import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";

export class FindPostsQueryDto extends PaginationQueryDto{
    @IsOptional()
    @IsString({
        message: 'Title must be a string'
    })
    @MaxLength(100, {
        message: 'Title can not be longer than 100 charaters'
    })
    title?: string
}