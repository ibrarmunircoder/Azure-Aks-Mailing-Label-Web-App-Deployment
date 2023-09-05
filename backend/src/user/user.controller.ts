import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  Patch,
  Query,
} from '@nestjs/common';
import { IsAuthorizedGuard } from 'src/auth/guards';
import { UserRoleEnum } from 'src/user/enums';
import { UserService } from 'src/user/user.service';
import {
  UserAssignBrandsDto,
  UserCreateDto,
  UserIsActiveDto,
  UsersQueryDto,
} from 'src/user/dtos';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(new IsAuthorizedGuard([UserRoleEnum.SUPER_ADMIN]))
  @HttpCode(HttpStatus.OK)
  @Post('permission/brands')
  assignBrands(@Body() body: UserAssignBrandsDto) {
    return this.userService.assignBrands(body);
  }
  @UseGuards(new IsAuthorizedGuard([UserRoleEnum.SUPER_ADMIN]))
  @Post('/')
  create(@Body() body: UserCreateDto) {
    return this.userService.create(body);
  }

  @UseGuards(new IsAuthorizedGuard([UserRoleEnum.SUPER_ADMIN]))
  @Get('/')
  getAll(@Query() query: UsersQueryDto) {
    return this.userService.getAll(query);
  }

  @UseGuards(new IsAuthorizedGuard([UserRoleEnum.SUPER_ADMIN]))
  @Patch('/active')
  activateUser(@Body() body: UserIsActiveDto) {
    return this.userService.activateUser(body);
  }
}
