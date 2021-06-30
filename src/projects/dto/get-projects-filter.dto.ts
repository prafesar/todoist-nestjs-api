import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ProjectStatus } from '../project-status.enum';

type sortType = 'asc' | 'desc';

export class GetProjectsFilterDto {

  @IsOptional()
  @IsString()
  userId?: string; // search all projects by userId

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
