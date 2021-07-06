import { IsOptional, IsString } from 'class-validator';

export class GetUserDto {

  @IsOptional()
  @IsString()
  login?: string;

  @IsOptional()
  @IsString()
  email?: string;

}
