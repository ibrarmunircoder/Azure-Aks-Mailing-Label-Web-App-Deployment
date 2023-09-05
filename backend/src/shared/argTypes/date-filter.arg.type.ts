import { IsDate } from 'class-validator';

export class DateFilterArgType {
  @IsDate()
  moreThan?: Date;
  @IsDate()
  lessThan?: Date;
  @IsDate()
  moreThanEqual?: Date;
  @IsDate()
  lessThanEqual?: Date;
  @IsDate()
  equalTo?: Date;
  @IsDate()
  notEqualTo?: Date;
}
