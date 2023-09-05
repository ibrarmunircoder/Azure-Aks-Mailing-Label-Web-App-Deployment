import {
  IsString,
  IsEmail,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

import { RecycleDonateEnum } from '../enums';

export class AddressCreateDto {
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
  city: string;

  @IsString()
  @MaxLength(2)
  state: string;

  @IsString()
  @IsOptional()
  carrier: string;

  @IsString()
  @MaxLength(5)
  zipcode: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(RecycleDonateEnum)
  @IsOptional()
  recycleDonate: RecycleDonateEnum;

  @IsString()
  @IsOptional()
  program: string;
}
