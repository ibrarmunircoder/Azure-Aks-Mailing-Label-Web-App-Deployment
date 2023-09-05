import { IsString, IsEmail, MinLength } from 'class-validator';

export class AuthResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
