import { IsEnum } from 'class-validator';
import { TaskPriority } from '../task-Priority.enum';

export class UpdateTaskPriorityDto {
  @IsEnum(TaskPriority)
  status: TaskPriority;
}
