import {
  Controller,
  Body,
  Post,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserResponseInterface } from 'src/users/types/user-response.interface';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('/register')
  async register(@Body('user') dto: CreateUserDto): Promise<UserResponseInterface> {
    return await this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() dto: AuthCredentialsDto): Promise<UserResponseInterface> {
    return this.authService.login(dto);
  }
  
  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
  }

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req)
  }
}
