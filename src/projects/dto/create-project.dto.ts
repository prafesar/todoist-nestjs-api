import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  user_id: string;

  @IsOptional()
  description?: string;

}
