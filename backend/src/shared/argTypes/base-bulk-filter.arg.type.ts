import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { IdBulkFilterArgType } from 'src/shared/argTypes';

export class BaseBulkFilterArgType {
  @ValidateNested()
  @Type(() => IdBulkFilterArgType)
  id?: IdBulkFilterArgType;
}
