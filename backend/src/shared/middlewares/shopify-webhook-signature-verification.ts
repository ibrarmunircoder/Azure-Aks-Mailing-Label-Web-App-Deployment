import {
  Inject,
  Injectable,
  ForbiddenException,
  NestMiddleware,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { applicationConfig } from 'src/config/app.config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

@Injectable()
export class ShopifyWebhookSignatureVerification implements NestMiddleware {
  constructor(
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
  ) {}
  use(req: RawBodyRequest<Request>, res: Response, next: NextFunction): void {
    const webhookSecretKey = this.appConfig.shopify.webhookSecret;
    const hmac = req.get('x-shopify-hmac-sha256');

    if (!hmac) {
      throw new ForbiddenException();
    }

    const body = req.rawBody;

    const hash = crypto
      .createHmac('sha256', webhookSecretKey)
      .update(body)
      .digest('base64');
    console.log({ hash }, { hmac });

    if (hmac !== hash) {
      throw new ForbiddenException();
    }
    next();
  }
}
