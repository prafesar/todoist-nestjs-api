import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  description: string;

}
