import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  
  @IsNotEmpty()
  taskId: string;

  @IsNotEmpty()
  UserId: string;
  
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  description: string;

}
