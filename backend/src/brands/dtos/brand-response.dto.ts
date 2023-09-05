import { Expose } from 'class-transformer';

export class BrandResponseDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  hostname: string;
  @Expose()
  logo: string;
  @Expose()
  description: string;
  @Expose()
  website: string;
  @Expose()
  templateName: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
