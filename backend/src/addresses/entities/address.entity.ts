import { BrandsEntity } from 'src/brands/entities/brands.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecycleDonateEnum } from 'src/addresses/enums';

@Entity({ name: 'address' })
export class AddressEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: false })
  addressLine1: string;

  @Column({ type: 'varchar', nullable: true })
  emailId: string;

  @Column({ type: 'varchar', nullable: true })
  emailStatus: string;

  @Column({ type: 'varchar', nullable: true })
  emailFailedReason: string;

  @Column({ type: 'varchar', nullable: true })
  addressLine2: string;

  @Column({ type: 'varchar', nullable: false })
  base64PDF: string;

  @Column({ type: 'varchar', nullable: false })
  trackingNumber: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  state: string;

  @Column({ type: 'varchar', nullable: false })
  zipcode: string;

  @Column({ type: 'varchar', nullable: false })
  status: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: 'Mail Back-Brand Supported',
  })
  program: string = 'Mail Back-Brand Supported';

  @Column({ type: 'varchar', nullable: true })
  carrier: string;

  @Column({ type: 'date', nullable: false })
  deliveryDate: string;

  @Column({ type: 'integer', nullable: false })
  brandId: number;

  @ManyToOne(() => BrandsEntity, (brand) => brand.addresses, {
    nullable: false,
    cascade: ['remove'],
  })
  brand: BrandsEntity;
  @Column({
    nullable: true,
    type: 'enum',
    enum: Object.values(RecycleDonateEnum),
    enumName: 'recycle_donate',
  })
  recycleDonate: RecycleDonateEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
