import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  BaseFilterArgType,
  IdFilterArgType,
  StringFilterArgType,
} from 'src/shared/argTypes';

export class AddressFilterDto extends BaseFilterArgType {
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
  @Type(() => StringFilterArgType)
  addressLine1?: StringFilterArgType;

  @ValidateNested()
  @Type(() => StringFilterArgType)
  addressLine2?: StringFilterArgType;

  @ValidateNested()
  @Type(() => StringFilterArgType)
  emailId?: StringFilterArgType;

  @ValidateNested()
  @Type(() => StringFilterArgType)
  emailStatus?: StringFilterArgType;

  @ValidateNested()
  @Type(() => StringFilterArgType)
  city?: StringFilterArgType;

  @ValidateNested()
  @Type(() => StringFilterArgType)
  state?: StringFilterArgType;

  @ValidateNested()
  @Type(() => StringFilterArgType)
  country?: StringFilterArgType;

  @ValidateNested()
  @Type(() => StringFilterArgType)
  zipcode?: StringFilterArgType;

  @ValidateNested()
  @Type(() => StringFilterArgType)
  program?: StringFilterArgType;

  @ValidateNested()
  @Type(() => IdFilterArgType)
  brandId?: IdFilterArgType;

  @Type(() => StringFilterArgType)
  recycleDonate?: StringFilterArgType;
}
