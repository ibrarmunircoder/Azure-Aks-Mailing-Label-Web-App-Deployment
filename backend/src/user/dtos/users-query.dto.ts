import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseArgType } from 'src/shared/argTypes';
import { UsersFilterDto } from 'src/user/dtos';

export class UsersQueryDto extends BaseArgType {
  @IsString()
  @IsOptional()
  search?: string;

  @ValidateNested()
  @Type(() => UsersFilterDto)
  filter?: UsersFilterDto;
}
