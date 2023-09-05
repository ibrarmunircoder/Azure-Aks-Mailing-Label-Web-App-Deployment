import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseArgType } from 'src/shared/argTypes';
import { AddressFilterDto } from './address-filter.dto';

export class AddressQueryDto extends BaseArgType {
  @IsString()
  @IsOptional()
  search?: string;

  @ValidateNested()
  @Type(() => AddressFilterDto)
  filter?: AddressFilterDto;
}
