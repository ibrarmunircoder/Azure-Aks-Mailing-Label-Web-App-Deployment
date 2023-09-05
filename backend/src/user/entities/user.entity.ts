import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from 'src/user/enums';
import { UserBrandsAssignedEntity } from 'src/user/entities';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Object.values(UserRoleEnum),
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean;

  @OneToMany(() => UserBrandsAssignedEntity, (userBrand) => userBrand.user)
  userBrandsAssigned: Array<UserBrandsAssignedEntity>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
