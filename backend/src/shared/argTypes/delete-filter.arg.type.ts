import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { DeleteArgType } from 'src/shared/argTypes';

export class DeleteFilterArgType {
  @ValidateNested()
  @Type(() => DeleteArgType)
  id?: DeleteArgType;
}
