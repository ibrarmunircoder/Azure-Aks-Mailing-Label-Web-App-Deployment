import { IsNumber } from 'class-validator';

export class IdBulkFilterArgType {
  @IsNumber()
  equalTo?: string;
}
