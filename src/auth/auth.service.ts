import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { JwtsService } from '../jwts/jwts.service';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { USER_NOT_EXIST, WRONG_PASSWORD } from './constants';
import { ConfigService } from '@nestjs/config';
import { UserResponseInterface } from 'src/users/types/userResponse.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from 'src/users/users.repository';
import { RolesGuard } from './guards/roles.guard';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
    private readonly jwtsService: JwtsService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user: UserEntity = await this.usersService.createUser(createUserDto);
    return this.buildUserResponse(user, 'local', '')
  }

  async login(
    dto: AuthCredentialsDto,
  ): Promise<UserResponseInterface> {
    const user: UserEntity = await this.getAuthenticatedUser(dto);
    const token = this.generateJwt(user);
    return this.buildUserResponse(user, 'jwt', token);
  }

  async getAuthenticatedUser({ email, password }: AuthCredentialsDto): Promise<UserEntity> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_EXIST);
    }
    
    this.verifyPassword(password, user.password);
    delete user.password;
    return user;
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    const isPasswordMatching: boolean = await compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }
    return true; 
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

    return {
      message: 'User information from google',
      user: req.user
    }
  }
}
