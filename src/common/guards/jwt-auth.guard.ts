import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtsService } from '../../jwts/jwts.service';

import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly usersService: UsersService,
    private jwtsService: JwtsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const header = request.header('Authorization');
    if (!header) {
      throw new HttpException(
        'Authorization: Bearer <token> header missing',
        HttpStatus.UNAUTHORIZED
      );
    }

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new HttpException(
        'Authorization: Bearer <token> header invalid', 
        HttpStatus.UNAUTHORIZED
      );
    }

    const token = parts[1];

    try {
      // Store the user on the request object if we want to retrieve it from the controllers
      const payload: any = this.jwtsService.decode(token);
      request['user'] = await this.usersService.getUserById(payload.userId);
      return true;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}