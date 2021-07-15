import { IsNotEmpty, IsOptional } from 'class-validator';

import { TaskEntity } from '../../tasks/task.entity';
import { UserEntity } from '../../users/user.entity';

export class CreateCommentDto {
  
  @IsNotEmpty()
  task: TaskEntity;

  @IsNotEmpty()
  author: UserEntity;
  
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  description: string;

}
