import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserEntity } from 'src/user/entities';
import { UserRoleEnum } from 'src/user/enums';

@Injectable()
export class IsAuthorizedGuard extends AuthGuard('jwt') {
  constructor(private allowedRoles: UserRoleEnum[]) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<User = UserEntity>(
    err: string | Record<string, unknown>,
    user: UserEntity,
  ): User {
    if (err || !user || !this.allowedRoles.includes(user.role)) {
      throw err || new ForbiddenException();
    }
    return user as unknown as User;
  }
}
