import { IsBoolean, IsNumber } from 'class-validator';

export class UserIsActiveDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  active: boolean;
}
