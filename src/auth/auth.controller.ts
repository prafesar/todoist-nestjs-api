import {
  Controller,
  Body,
  Post,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserCredentialsDto } from 'src/users/dto/create-user-credentials.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('/register')
  register(@Body() createUserDto: CreateUserCredentialsDto): Promise<void> {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(dto);
  }
  
  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    console.log()
  }

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req)
  }
}
