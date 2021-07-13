import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { USER_NOT_EXIST } from '../constants';
import { UserEntity } from 'src/users/user.entity';

config()

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    readonly config: ConfigService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      // clientId: config.get('GOOGLE_CLIENT_ID'),
      // clientSecret: config.get('GOOGLE_SECRET'),
      // callbackURL: `${config.get('BASE_URL')}/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<void> {
    if (!profile) {
      done(new BadRequestException(), null);
    }
    const { emails } = profile;
    const email = emails[0].value;
    const user: UserEntity = await this.usersService.getUserByEmail(email);
    
    if (!user) {
      done(new UnauthorizedException(USER_NOT_EXIST), null);
    }
    // wright in req.user
    const userResponse = this.authService.buildUserResponse(user, 'google', accessToken);
    done(null, userResponse.user);
  }
}