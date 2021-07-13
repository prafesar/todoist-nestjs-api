import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

}
