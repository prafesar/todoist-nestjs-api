import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtsService } from '../jwts/jwts.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';

import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserCredentialsDto } from '../users/dto/create-user-credentials.dto';
import { TokenPayload } from './token-payload.interface';
import { USER_NOT_EXIST, WRONG_PASSWORD } from './config/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtsService: JwtsService,
  ) {}

  async signUp(createUserDto: CreateUserCredentialsDto) {
    return this.usersService.createUser(createUserDto);
  }

  async signIn(
    dto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user: User = await this.getAuthenticatedUser(dto);
    return this.getToken(user.id);
  }

  async getAuthenticatedUser({ email, password }: AuthCredentialsDto): Promise<User> {
    const  user: User = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_EXIST);
    }
    
    this.verifyPassword(password, user.passHash);
    user.passHash = undefined;

    return user;
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    const isPasswordMatching: boolean = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }
    return true; 
  }

  getToken(userId: string): { accessToken: string } {
    const payload: TokenPayload = { userId };
    const accessToken: string = this.jwtsService.sign(payload);
    return { accessToken };
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
  }
}
