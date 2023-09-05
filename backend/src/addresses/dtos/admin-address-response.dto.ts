import { Exclude, Expose, Type } from 'class-transformer';
import { BrandsEntity } from 'src/brands/entities';
import { RecycleDonateEnum } from 'src/addresses/enums';
import { BrandResponseDto } from 'src/brands/dtos';

export class AdminAddressResponseDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  addressLine1: string;
  @Expose()
  emailId: string;
  @Expose()
  emailStatus: string;
  @Expose()
  emailFailedReason: string;
  @Expose()
  addressLine2: string;
  @Expose()
  base64PDF: string;
  @Expose()
  trackingNumber: string;
  @Expose()
  city: string;
  @Expose()
  state: string;
  @Expose()
  zipcode: string;
  @Expose()
  status: string;
  @Expose()
  carrier: string;
  @Expose()
  deliveryDate: string;
  @Expose()
  brandId: number;
  @Expose()
  @Type(() => BrandResponseDto)
  brand: BrandResponseDto;
  @Expose()
  recycleDonate: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
