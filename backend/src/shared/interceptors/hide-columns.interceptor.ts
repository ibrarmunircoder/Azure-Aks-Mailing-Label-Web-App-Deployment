import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { RequestWithUser } from 'src/shared/interfaces';

@Injectable()
export class HideColumnsInterceptor implements NestInterceptor {
  constructor(@Inject('hideColumns') private hideColumns: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    const hideColumnsBasedOnRole = (data: any): any => {
      return this.hideColumns(data, user);
    };

    return next.handle().pipe(map((data) => hideColumnsBasedOnRole(data)));
  }
}
