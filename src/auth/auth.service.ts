import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { USER_NOT_EXIST, WRONG_PASSWORD } from './constants';
import { UserResponseInterface } from '../users/types/user-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.usersService.createUser(createUserDto);
  }

  async login(
    dto: AuthCredentialsDto,
  ): Promise<UserResponseInterface> {
    const user = await this.getAuthenticatedUser(dto);
    const token = this.generateJwt(user);
    // respons for frontend
    return this.buildUserResponse(user, 'jwt', token);
  }

  async getAuthenticatedUser({ email, password }: AuthCredentialsDto): Promise<UserEntity> {
    const user = await this.usersService.getUserWithPassByEmail(email);
    await this.verifyPassword(password, user.password);
    delete user.password;
    return user;
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    const isPasswordMatching = await compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }
    return isPasswordMatching;
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.login,
        email: user.email,
        role: user.role,
      },
      this.config.get('JWT_SECRET'),
    );
  }

  buildUserResponse(user: UserEntity, strategy: string, token: string): UserResponseInterface {
    return {
      user: {
        ...user,
        token,
        strategy,
      },
    };
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    delete req.user.password;
    return {
      message: 'User information from google',
      user: req.user
    }
  }
}
