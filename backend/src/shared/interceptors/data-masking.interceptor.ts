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
export class DataMaskingInterceptor implements NestInterceptor {
  constructor(@Inject('maskData') private maskData: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    const maskSensitiveData = (data: any): any => {
      return this.maskData(data, user);
    };

    return next.handle().pipe(map((data) => maskSensitiveData(data)));
  }
}
