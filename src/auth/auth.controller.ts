import {
  Controller,
  Body,
  Post,
  Get,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // register
  @Post('/register')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }
  // login
  @Post('/login')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
  
  // logout
}
