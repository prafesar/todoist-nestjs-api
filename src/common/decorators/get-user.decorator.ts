import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../users/user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UserEntity => {
    const host = ctx.switchToHttp()
    const req = host.getRequest();
    return req.user;
  },
);
