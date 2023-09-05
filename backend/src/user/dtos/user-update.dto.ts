import {
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class UserUpdateDto {
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
}
