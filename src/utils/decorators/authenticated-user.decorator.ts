import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Get the authenticated user from the request.
 * Requires `AuthenticatedUserGuard` guard or `Authenticated` decorator on the request.
 */
export const AuthenticatedUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.authenticatedUser;
  },
);
