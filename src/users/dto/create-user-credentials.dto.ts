import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserCredentialsDto {

  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

}
