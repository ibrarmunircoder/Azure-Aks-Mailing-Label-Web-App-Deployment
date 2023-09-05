import {
  IsString,
  MaxLength,
  IsEmail,
  MinLength,
  IsEnum,
  IsDefined,
} from 'class-validator';
import { UserRoleEnum } from 'src/user/enums';

export class AuthRegisterDto {
  @IsString()
  @MaxLength(255)
  firstName: string;

  @IsString()
  @MaxLength(255)
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRoleEnum, {
    message: 'Please add a valid role',
  })
  @IsDefined()
  role: UserRoleEnum;
}
