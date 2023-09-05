import { UserRoleEnum } from "enums";
import { UserBrandsAssigned } from "interfaces";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userBrandsAssigned: UserBrandsAssigned[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: UserRoleEnum;
}
