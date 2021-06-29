import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  
  @IsNotEmpty()
  task_id: string;

  @IsNotEmpty()
  user_id: string;
  
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  description: string;

}
