import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ProjectStatus } from '../project-status.enum';

type sortType = 'asc' | 'desc';

export class GetProjectsFilterDto {

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
