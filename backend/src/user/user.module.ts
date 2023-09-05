import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserEntity, UserBrandsAssignedEntity } from 'src/user/entities';
import { UserController } from 'src/user/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserBrandsAssignedEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
