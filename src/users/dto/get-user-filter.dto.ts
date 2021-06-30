import { IsOptional, IsString } from 'class-validator';

export class GetUserFilterDto {

  @IsOptional()
  @IsString()
  project?: string;

  @IsOptional()
  @IsString()
  search?: string;

}
