import { IsNotEmpty, IsOptional } from 'class-validator';

import { Task } from 'src/tasks/task.entity';
import { UserEntity } from 'src/users/user.entity';

export class CreateCommentDto {
  
  @IsNotEmpty()
  task: Task;

  @IsNotEmpty()
  author: UserEntity;
  
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  description: string;

}
