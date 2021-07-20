import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback } from 'passport-google-oauth20';

import { AuthService } from '../auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string, done: VerifyCallback): Promise<void> {
    // get user data
    const dto: AuthCredentialsDto = { email, password };
    const user = await this.authService.getAuthenticatedUser(dto);
    // wright in req.user
    const userResponse = this.authService.buildAuthUserResponse(user, 'local', '');
    done(null, userResponse.user);
  }
}