import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

config()

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    if (!profile) {
      done(new BadRequestException(), null);
    }
    
    // Get google account information
    const { emails } = profile
    const email = emails[0].value;
    const user = await this.usersService.getUserByEmail(email);
    
    if (!user) {
      done(new HttpException(
        'dont have this user',
        HttpStatus.UNAUTHORIZED,
      ), null);
    }
    this.authService.sendToken(user.id);
    
    done(undefined, user);
  }
}