import {
  BaseArgType,
  IdFilterInterface,
  Sort,
  StringFilterInterface,
} from "interfaces";

export interface UsersFilter {
  id?: IdFilterInterface;
  firstName?: StringFilterInterface;
  lastName?: StringFilterInterface;
  email?: StringFilterInterface;
}

export interface UsersQuery extends BaseArgType {
  order?: Sort;
  search?: string;
  filter?: UsersFilter | null;
}
