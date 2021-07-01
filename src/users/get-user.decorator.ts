import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const host = ctx.switchToHttp()
    const req = host.getRequest();
    return req.user;
  },
);
