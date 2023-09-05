import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class IdFilterArgType {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  equalTo?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  notEqualTo?: number;

  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      const values = value.map(Number);
      return values;
    }
    return [parseInt(value)];
  })
  @IsOptional()
  valueNotIn?: number[];

  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      const values = value.map(Number);
      return values;
    }
    return [parseInt(value)];
  })
  @IsOptional()
  valueIn?: number[];
}
