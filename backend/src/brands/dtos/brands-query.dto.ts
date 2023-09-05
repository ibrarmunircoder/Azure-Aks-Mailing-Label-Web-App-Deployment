import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseArgType } from 'src/shared/argTypes';
import { BrandsFilterDto } from 'src/brands/dtos';

export class BrandsQueryDto extends BaseArgType {
  @IsString()
  @IsOptional()
  search?: string;

  @ValidateNested()
  @Type(() => BrandsFilterDto)
  filter?: BrandsFilterDto;
}
