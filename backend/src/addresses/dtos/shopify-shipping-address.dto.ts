import { Expose, Transform } from 'class-transformer';

export class ShopifyShippingAddressDto {
  @Transform(({ obj }) => obj?.shipping_address?.email ?? obj.email)
  @Expose()
  email: string;
  @Transform(({ obj }) => obj?.shipping_address?.first_name ?? '')
  @Expose()
  firstName: string;
  @Transform(({ obj }) => obj?.shipping_address?.last_name ?? '')
  @Expose()
  lastName: string;
  @Transform(({ obj }) => obj?.shipping_address?.address1 ?? '')
  @Expose()
  addressLine1: string;
  @Transform(({ obj }) => obj?.shipping_address?.address2 ?? '')
  @Expose()
  addressLine2: string;
  @Transform(({ obj }) => obj?.shipping_address?.city ?? '')
  @Expose()
  city: string;
  @Transform(({ obj }) => obj?.shipping_address?.province_code ?? '')
  @Expose()
  state: string;
  @Transform(({ obj }) => obj?.shipping_address?.phone ?? '')
  @Expose()
  phone: string;
  @Transform(({ obj }) => obj?.shipping_address?.zip ?? '')
  @Expose()
  zipcode: string;
}
