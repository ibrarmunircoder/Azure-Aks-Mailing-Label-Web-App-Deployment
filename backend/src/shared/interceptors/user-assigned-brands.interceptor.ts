import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserEntity } from 'src/user/entities';
import { UserRoleEnum } from 'src/user/enums';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserAssignedBrandsInterceptor implements NestInterceptor {
  constructor(private userService: UserService, private fieldName: string) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    if ([UserRoleEnum.USER].includes(user.role)) {
      const userBrandsAssigned = await this.userService.getUserBrands(user.id);
      request.query = {
        ...request.query,
        filter: {
          ...(request.query?.filter || {}),
          [this.fieldName]: {
            valueIn:
              request?.query?.filter?.brandId?.valueIn ||
              userBrandsAssigned?.map((obj) => obj.brandId.toString()) ||
              [],
          },
        },
      };
    }
    if ([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN].includes(user.role)) {
      if ('filter' in request.query) {
        request.query = {
          ...request.query,
          filter: {
            ...request.query.filter,
            ...(this.fieldName in request?.query?.filter
              ? {
                  [this.fieldName]: {
                    valueIn: request?.query?.filter?.brandId?.valueIn || [],
                  },
                }
              : {}),
          },
        };
      }
    }
    return next.handle();
  }
}
