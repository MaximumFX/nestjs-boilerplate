import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Get the JWT user from the request.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
