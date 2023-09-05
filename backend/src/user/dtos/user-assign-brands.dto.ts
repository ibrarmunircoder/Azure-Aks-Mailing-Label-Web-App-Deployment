import { IsNumber, IsArray, IsDefined } from 'class-validator';

export class UserAssignBrandsDto {
  @IsNumber()
  userId: number;

  @IsArray()
  @IsDefined()
  brands: number[];
}
