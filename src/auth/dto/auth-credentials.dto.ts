import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class AuthCredentialsDto {

  @IsNotEmpty()
  @IsOptional()
  login?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  password: string;

}
