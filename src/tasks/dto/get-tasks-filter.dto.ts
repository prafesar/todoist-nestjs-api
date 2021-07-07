import { IsEnum, IsOptional, IsString } from 'class-validator';

import { TaskPriority } from '../task-priority.enum';
import { TaskStatus } from '../task-status.enum';

type sortType = 'asc' | 'desc';

export class GetTasksFilterDto {

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  authorId?: string;

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

  @IsOptional()
  @IsString()
  userId?: string;

}
