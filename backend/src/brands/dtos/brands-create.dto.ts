import { IsString, MaxLength, IsOptional } from 'class-validator';

export class BrandsCreateDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  hostname: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  website?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  templateName?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  logo?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;
}
