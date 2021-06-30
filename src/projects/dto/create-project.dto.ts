import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectDto {
  
  @IsNotEmpty()
  authorId: string;

  @IsNotEmpty()
  title: string;
  
  @IsOptional()
  description?: string;

}
