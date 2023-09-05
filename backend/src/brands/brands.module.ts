import { Module } from '@nestjs/common';
import { BrandsController } from 'src/brands/brands.controller';
import { BrandsService } from 'src/brands/brands.service';
import { BrandsEntity } from 'src/brands/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAssignedBrandsInterceptor } from 'src/shared/interceptors';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BrandsEntity]), UserModule],
  controllers: [BrandsController],
  providers: [
    BrandsService,
    UserAssignedBrandsInterceptor,
    {
      provide: String,
      useValue: 'id',
    },
  ],
  exports: [BrandsService],
})
export class BrandsModule {}
