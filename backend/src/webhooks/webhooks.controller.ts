import { Body, Controller, Post } from '@nestjs/common';
import { WebhooksService } from 'src/webhooks/webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private webhookService: WebhooksService) {}
  @Post('mailgun/status')
  mailgunDelivered(@Body() body: any) {
    const eventData = body['event-data'];
    return this.webhookService.updateEmailStatus(
      eventData.message.headers['message-id'],
      eventData.event,
      eventData.reason,
    );
  }
}
