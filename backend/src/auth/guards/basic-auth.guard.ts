import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  CanActivate,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { applicationConfig } from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.handleRequest(request);
  }

  handleRequest(
    request: Request,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const b64auth = (request.headers.authorization || '').split(' ')[1] || '';
    const password = Buffer.from(b64auth, 'base64').toString('ascii');

    if (password && password === this.appConfig.basicAuth.password) {
      return true;
    }
    return false;
  }
}
