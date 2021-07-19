import {
  Controller,
  Body,
  Post,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseInterface } from '../users/types/user-response.interface';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('/register')
  async register(@Body('user') dto: CreateUserDto): Promise<UserResponseInterface> {
    const newUser: UserEntity = await this.authService.register(dto);
    return this.authService.buildUserResponse(newUser, 'local', ''); 
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
