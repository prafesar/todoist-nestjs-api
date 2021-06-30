import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  
  @IsNotEmpty()
  taskId: string;

  @IsNotEmpty()
  authorId: string;
  
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  description: string;

}
