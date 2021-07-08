import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtsService {
  constructor(
    private readonly jwtService: JwtService,
  ){}

  sign(payload: string | object): string {
    return this.jwtService.sign(payload);
  }

  decode(token: string): string | { [key: string]: any; } {
    return this.jwtService.decode(token)
  }
}
