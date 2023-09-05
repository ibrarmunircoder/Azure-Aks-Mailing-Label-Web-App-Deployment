import { IsBoolean } from 'class-validator';

export class BooleanFilterArgType {
  @IsBoolean()
  equalTo?: boolean;

  @IsBoolean()
  notEqualTo?: boolean;
}
