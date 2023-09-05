import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { MailgunWebhookSignatureValidation } from 'src/webhooks/middlewares';
import { WebhooksService } from './webhooks.service';
import { AddressesModule } from 'src/addresses/addresses.module';

@Module({
  imports: [AddressesModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MailgunWebhookSignatureValidation).forRoutes({
      path: 'webhooks/mailgun/status',
      method: RequestMethod.POST,
    });
  }
}
