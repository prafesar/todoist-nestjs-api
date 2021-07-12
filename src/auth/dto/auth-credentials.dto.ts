import { IsNotEmpty, IsEmail } from 'class-validator';

export class AuthCredentialsDto {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

}
