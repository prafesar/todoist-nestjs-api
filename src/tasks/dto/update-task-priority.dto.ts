import { IsEnum } from 'class-validator';
import { TaskPriority } from '../../common/enums/task-priority.enum';

export class UpdateTaskPriorityDto {

  @IsEnum(TaskPriority)
  priority: TaskPriority;

}
