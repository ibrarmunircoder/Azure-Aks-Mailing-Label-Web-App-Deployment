import {
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  IsBoolean,
  IsArray,
  IsEnum,
  IsDefined,
} from 'class-validator';
import { UserRoleEnum } from 'src/user/enums';

export class UserCreateDto {
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  password: string;

  @IsString()
  @MaxLength(255)
  firstName: string;

  @IsString()
  @MaxLength(255)
  lastName: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsEnum(UserRoleEnum, {
    message: 'Please add a valid role',
  })
  @IsDefined()
  role: UserRoleEnum;

  @IsArray()
  assignedBrands?: number[];
}
