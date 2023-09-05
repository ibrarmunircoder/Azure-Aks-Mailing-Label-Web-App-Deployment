import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { applicationConfig } from 'src/config/app.config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

@Injectable()
export class MailgunWebhookSignatureValidation implements NestMiddleware {
  constructor(
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
  ) {}
  use(req: Request, res: Response, next: NextFunction): void {
    const webhookApiKeySecreteKey = this.appConfig.mailgun.apiKey;
    const token = req.body.signature?.token;
    const timestamp = req.body.signature?.timestamp;
    const signature = req.body.signature?.signature;

    if (!token || !timestamp || !signature) {
      throw new BadRequestException('Invalid Request!');
    }
    const hash = crypto
      .createHmac('sha256', webhookApiKeySecreteKey)
      .update(timestamp + token)
      .digest('hex');

    if (signature !== hash) {
      throw new BadRequestException('Invalid Request!');
    }
    next();
  }
}
