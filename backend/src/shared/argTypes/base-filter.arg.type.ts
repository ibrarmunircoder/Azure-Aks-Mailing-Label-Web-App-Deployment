import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IdFilterArgType, StringFilterArgType } from 'src/shared/argTypes';

export class BaseFilterArgType {
  @ValidateNested()
  @Type(() => IdFilterArgType)
  id?: IdFilterArgType;

  @ValidateNested()
  @Type(() => StringFilterArgType)
  createdAt?: StringFilterArgType;

  @ValidateNested()
  @Type(() => StringFilterArgType)
  updatedAt?: StringFilterArgType;
}
