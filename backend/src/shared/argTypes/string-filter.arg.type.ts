import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { DateRangeFilterArgType } from './date-range-filter.arg.type';
import { Type } from 'class-transformer';

export class StringFilterArgType {
  @IsString()
  @IsOptional()
  equalTo?: string;

  @IsString()
  @IsOptional()
  notEqualTo?: string;

  @IsString({ each: true })
  @IsOptional()
  valueNotIn?: string[];

  @IsString({ each: true })
  @IsOptional()
  valueIn?: string[];

  @IsString()
  @IsOptional()
  like?: string;

  @IsString()
  @IsOptional()
  iLike?: string;
  @IsString()
  @IsOptional()
  moreThan?: string;
  @IsString()
  @IsOptional()
  lessThan?: string;
  @IsString()
  @IsOptional()
  moreThanEqual?: string;
  @IsString()
  @IsOptional()
  lessThanEqual?: string;

  @ValidateNested()
  @Type(() => DateRangeFilterArgType)
  between?: DateRangeFilterArgType;

  @IsOptional()
  isNull?: null;
}
