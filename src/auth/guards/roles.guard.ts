import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersServices } from '../../users/services/user.service';
import { Role } from '../../users/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersServices: UsersServices,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    let { user } = context.switchToHttp().getRequest();
    user = await this.usersServices.findById(user.userId);
    if (requiredRoles.some((role) => user.role == role)) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
