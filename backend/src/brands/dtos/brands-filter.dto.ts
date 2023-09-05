import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseFilterArgType, StringFilterArgType } from 'src/shared/argTypes';

export class BrandsFilterDto extends BaseFilterArgType {
  @ValidateNested()
  @Type(() => StringFilterArgType)
  name?: StringFilterArgType;
}
