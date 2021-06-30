import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ProjectStatus } from '../project-status.enum';

type sortType = 'asc' | 'desc';

export class GetTasksFilterDto {

  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: sortType;

}
