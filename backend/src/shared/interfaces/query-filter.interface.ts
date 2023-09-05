import { DateFilterInterface, IdFilterInterface } from 'src/shared/interfaces';

export interface QueryFilterInterface {
  id?: IdFilterInterface;
  createdAt?: DateFilterInterface;
  updatedAt?: DateFilterInterface;
}
