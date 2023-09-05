import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserEntity } from 'src/user/entities';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<User = UserEntity>(
    err: string | Record<string, unknown>,
    user: UserEntity,
  ): User {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user as unknown as User;
  }
}
