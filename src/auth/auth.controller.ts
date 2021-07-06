import {
  Controller,
  Body,
  Post,
} from '@nestjs/common';
import { CreateUserCredentialsDto } from 'src/users/dto/create-user-credentials.dto';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // register
  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserCredentialsDto): Promise<void> {
    return this.authService.signUp(createUserDto);
  }
  // login
  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
  
  // logout
}
