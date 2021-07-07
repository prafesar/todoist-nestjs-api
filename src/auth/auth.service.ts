import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';

import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserCredentialsDto } from 'src/users/dto/create-user-credentials.dto';
import { JwtPayload } from './strategies/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserCredentialsDto) {
    return this.usersService.createUser(createUserDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, login, password } = authCredentialsDto;
    let userId: string;
    let user: User;
    if (login) {
      user = await this.usersService.getUserByLogin(login);
      userId = user.id;
    }
    if (email) {
      user = await this.usersService.getUserByEmail(email);
      userId = user.id;
    }
    
    if (user && (await bcrypt.compare(password, user.passHash))) {
      const payload: JwtPayload = { userId };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  // googleLogin(req) {
  //   if (!req.user) {
  //     return 'No user from google'
  //   }

  //   return {
  //     message: 'User information from google',
  //     user: req.user
  //   }
  // }
}
