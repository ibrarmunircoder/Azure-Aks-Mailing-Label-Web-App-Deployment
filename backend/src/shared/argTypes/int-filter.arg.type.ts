import { IsNumber, IsOptional } from 'class-validator';

export class IntFilterArgType {
  @IsNumber()
  @IsOptional()
  equalTo?: number;

  @IsNumber()
  @IsOptional()
  notEqualTo?: number;

  @IsNumber()
  @IsOptional()
  moreThan?: number;

  @IsNumber()
  @IsOptional()
  lessThan?: number;

  @IsNumber()
  @IsOptional()
  moreThanEqual?: number;

  @IsNumber()
  @IsOptional()
  lessThanEqual?: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  valueNotIn?: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  valueIn?: number[];
}
