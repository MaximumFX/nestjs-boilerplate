import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../auth/auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const roles = this.reflector.getAllAndOverride<(number | string)[]>(
      'roles',
      [context.getClass(), context.getHandler()],
    );

    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.authenticatedUser ?? request.user;

    return roles.map(String).includes(String(user?.role?.id));
  }
}
