import { IsDefined, IsEnum, IsString } from 'class-validator';
import { OrderEnum } from 'src/shared/enums';

export class OrderArgType {
  @IsDefined()
  @IsEnum(OrderEnum)
  order: OrderEnum;

  @IsString()
  sort: string;
}
