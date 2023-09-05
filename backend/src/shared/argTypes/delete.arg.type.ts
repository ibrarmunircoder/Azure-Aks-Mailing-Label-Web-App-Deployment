import { IsNumber } from 'class-validator';

export class DeleteArgType {
  @IsNumber()
  equalTo?: number;
}
