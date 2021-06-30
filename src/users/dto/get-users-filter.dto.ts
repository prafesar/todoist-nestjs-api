import { IsOptional, IsString } from 'class-validator';

export class GetUsersFilterDto {

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  search?: string;

}
