import { RecycleDonateEnum } from 'enums';
import { Brand } from 'interfaces';

export interface Address {
  id: string;
  email: string;
  firstName: string;
  carrier: string;
  program: string;
  lastName: string;
  trackingNumber: string;
  addressLine1: string;
  addressLine2: string;
  emailStatus: string;
  recycleDonate: RecycleDonateEnum;
  status: string;
  dateOfDelivery: Date;
  country: string;
  city: string;
  state: string;
  deliveryDate: string;
  zipcode: number;
  brand?: Brand;
  base64PDF: string;
  createdAt: Date;
  updatedAt: Date;
}
