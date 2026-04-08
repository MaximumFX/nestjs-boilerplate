import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthenticatedUserGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request.user;

    if (!payload?.id) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    request.authenticatedUser = user;

    return true;
  }
}
