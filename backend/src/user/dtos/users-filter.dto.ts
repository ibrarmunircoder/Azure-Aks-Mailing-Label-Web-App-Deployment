import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  BaseFilterArgType,
  BooleanFilterArgType,
  StringFilterArgType,
} from 'src/shared/argTypes';

export class UsersFilterDto extends BaseFilterArgType {
  @ValidateNested()
  @Type(() => StringFilterArgType)
  firstName?: StringFilterArgType;
  @ValidateNested()
  @Type(() => StringFilterArgType)
  lastName?: StringFilterArgType;
  @ValidateNested()
  @Type(() => StringFilterArgType)
  email?: StringFilterArgType;
  @ValidateNested()
  @Type(() => BooleanFilterArgType)
  active?: BooleanFilterArgType;
}
