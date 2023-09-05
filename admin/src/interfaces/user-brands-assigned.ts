import { Brand, User } from "interfaces";

export interface UserBrandsAssigned {
  id: number;
  userId: number;
  brandId: number;
  user: User;
  brand: Brand;
  createdAt: Date;
  updatedAt: Date;
}
