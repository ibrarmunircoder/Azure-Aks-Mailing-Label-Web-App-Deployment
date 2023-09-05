import { IsString, MaxLength, IsOptional } from 'class-validator';

export class BrandsUpdateDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  hostname?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  website?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  logo?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  templateName?: string;
}
