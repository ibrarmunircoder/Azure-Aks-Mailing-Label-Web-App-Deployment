import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { OrderArgType } from 'src/shared/argTypes';

export class BaseArgType {
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsNumber()
  @IsOptional()
  offset?: number;

  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ValidateNested()
  @IsOptional()
  @Type(() => OrderArgType)
  order?: OrderArgType;
}
