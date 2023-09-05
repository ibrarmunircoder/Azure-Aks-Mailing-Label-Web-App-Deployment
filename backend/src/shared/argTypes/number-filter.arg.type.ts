import { IsNumber } from 'class-validator';

export class NumberFilterArgType {
  @IsNumber()
  equalTo?: number;

  @IsNumber()
  notEqualTo?: number;

  @IsNumber()
  moreThan?: number;

  @IsNumber()
  lessThan?: number;

  @IsNumber()
  moreThanEqual?: number;

  @IsNumber()
  lessThanEqual?: number;

  @IsNumber({}, { each: true })
  valueNotIn?: number[];

  @IsNumber({}, { each: true })
  valueIn?: number[];
}
