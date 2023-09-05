import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { BrandsCreateDto, BrandsUpdateDto } from 'src/brands/dtos';
import { BrandsService } from './brands.service';
import { IsAuthorizedGuard, JwtAuthGuard } from 'src/auth/guards';
import { UserRoleEnum } from 'src/user/enums';
import { BrandsQueryDto } from 'src/brands/dtos';
import { UserAssignedBrandsInterceptor } from 'src/shared/interceptors';

@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @UseGuards(new IsAuthorizedGuard([UserRoleEnum.SUPER_ADMIN]))
  @Post('/')
  create(@Body() body: BrandsCreateDto) {
    return this.brandsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserAssignedBrandsInterceptor)
  @Get('/')
  getAll(@Query() query: BrandsQueryDto) {
    return this.brandsService.getAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: BrandsUpdateDto) {
    return this.brandsService.update(id, body);
  }
}
