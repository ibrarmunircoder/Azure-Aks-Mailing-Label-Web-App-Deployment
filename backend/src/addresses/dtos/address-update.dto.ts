import { IsString, IsEmail, MaxLength, IsOptional } from 'class-validator';

export class AddressUpdateDto {
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MaxLength(255)
  firstName: string;

  @IsString()
  @MaxLength(255)
  lastName: string;

  @IsString()
  @MaxLength(255)
  addressLine1: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  addressLine2: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  emailId: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  emailFailedReason: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  emailStatus: string;

  @IsString()
  @MaxLength(255)
  city: string;

  @IsString()
  @MaxLength(2)
  state: string;

  @IsString()
  @MaxLength(5)
  zipcode: string;
}
