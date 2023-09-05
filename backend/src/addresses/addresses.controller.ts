import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AddressesService } from 'src/addresses/addresses.service';
import { AddressCreateDto, AddressQueryDto } from 'src/addresses/dtos';
import { BasicAuthGuard, JwtAuthGuard } from 'src/auth/guards';
import {
  HideColumnsInterceptor,
  UserAssignedBrandsInterceptor,
} from 'src/shared/interceptors';
import { Cron } from '@nestjs/schedule';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Express } from 'express';

@Controller('addresses')
export class AddressesController {
  constructor(private addressService: AddressesService) {}

  @UseGuards(BasicAuthGuard)
  @Post('/')
  create(@Body() payload: AddressCreateDto) {
    return this.addressService.create(payload);
  }

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  generateShippingLabelWebhook(@Body() payload) {
    return this.addressService.webhookCreate(payload);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserAssignedBrandsInterceptor, HideColumnsInterceptor)
  @Get('/')
  getAll(@Query() query: AddressQueryDto) {
    return this.addressService.getAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  importLabels(@UploadedFile() file: Express.Multer.File) {
    return this.addressService.importLabels(file);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('/canada-shipment-label')
  // createCanadaShipmentLabel() {
  //   return this.addressService.createCanadaShipmentLabel();
  // }

  @UseGuards(JwtAuthGuard)
  @Post('/import/shopify/labels')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  importShopifyLabels(@UploadedFile() file: Express.Multer.File) {
    return this.addressService.importShopifyLabels(file);
  }

  @Delete('/admin-delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.deleteById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/brand/:brandId')
  deleteByBrandId(@Param('brandId', ParseIntPipe) brandId: number) {
    return this.addressService.deleteByBrandId(brandId);
  }

  @Cron('*/15 * * * *')
  updateAddressDeliveryDetails() {
    this.addressService.updateAddressDeliveryDetails();
  }
}
