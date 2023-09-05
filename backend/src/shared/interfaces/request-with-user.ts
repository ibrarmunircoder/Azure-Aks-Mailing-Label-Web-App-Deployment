import { UserEntity } from 'src/user/entities';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: UserEntity;
}
