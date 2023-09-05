import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { DeleteFilterArgType } from 'src/shared/argTypes';

export class BulkDeleteFilterArgType {
  @ValidateNested()
  @Type(() => DeleteFilterArgType)
  filter?: DeleteFilterArgType;
}
