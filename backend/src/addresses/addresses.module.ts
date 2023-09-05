import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesController } from 'src/addresses/addresses.controller';
import { AddressesService } from 'src/addresses/addresses.service';
import { AddressEntity } from 'src/addresses/entities';
import { MailgunService, MailingLabelService } from 'src/shared/services';
import { UserModule } from 'src/user/user.module';
import { BrandsModule } from 'src/brands/brands.module';
import { hideColumns, maskAddressesData } from 'src/addresses/utils';
import { ShopifyWebhookSignatureVerification } from 'src/shared/middlewares/shopify-webhook-signature-verification';
import { CanadaPostService } from 'src/shared/services/canada-post.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([AddressEntity]),
    BrandsModule,
  ],
  controllers: [AddressesController],
  providers: [
    AddressesService,
    MailingLabelService,
    MailgunService,
    CanadaPostService,
    {
      provide: String,
      useValue: 'brandId',
    },
    {
      provide: 'hideColumns',
      useValue: hideColumns,
    },
  ],
  exports: [AddressesService],
})
export class AddressesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ShopifyWebhookSignatureVerification).forRoutes({
      path: 'addresses/create',
      method: RequestMethod.POST,
    });
  }
}
