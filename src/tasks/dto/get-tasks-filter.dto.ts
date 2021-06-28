import { IsEnum, IsOptional, IsString } from 'class-validator';
import { sortType } from 'src/types/sort';
import { TaskPriority } from '../task-priority.enum';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  
  @IsOptional()
  @IsString()
  project?: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskStatus)
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: sortType;

}
