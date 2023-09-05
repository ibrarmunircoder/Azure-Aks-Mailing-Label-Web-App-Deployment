import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/entities';
import { BrandsEntity } from 'src/brands/entities';

@Entity({ name: 'user_brands_assigned' })
export class UserBrandsAssignedEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'integer', nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.userBrandsAssigned, {
    nullable: false,
    cascade: ['remove'],
  })
  user: UserEntity;

  @Column({ type: 'integer', nullable: false })
  brandId: number;

  @ManyToOne(() => BrandsEntity, {
    nullable: false,
    cascade: ['remove'],
  })
  brand: BrandsEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
