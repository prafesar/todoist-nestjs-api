import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from '../types/token-payload.interface';
import { UserEntity } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      // secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: TokenPayload): Promise<UserEntity> {
    // as alternative, can simple send token
    const { userId } = token;
    const user: UserEntity = await this.usersService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
