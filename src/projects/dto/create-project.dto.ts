import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  
  @IsNotEmpty()
  authorId: string;

  @IsNotEmpty()
  title: string;
  
  @IsOptional()
  description?: string;

}
