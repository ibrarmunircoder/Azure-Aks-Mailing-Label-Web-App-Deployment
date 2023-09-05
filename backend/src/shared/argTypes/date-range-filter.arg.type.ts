import { IsString } from 'class-validator';

export class DateRangeFilterArgType {
  @IsString()
  from?: string;

  @IsString()
  to?: string;
}
