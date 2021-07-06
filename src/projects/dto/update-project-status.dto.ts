import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ProjectStatus } from '../project-status.enum';

export class UpdateProjectStatusDto {
  
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

}
