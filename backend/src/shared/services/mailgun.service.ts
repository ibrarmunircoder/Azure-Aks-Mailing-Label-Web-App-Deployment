/* eslint-disable @typescript-eslint/no-var-requires */
import { IMailgunMailInput } from 'src/shared/interfaces';
import { Injectable, Inject } from '@nestjs/common';
import { applicationConfig } from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
const formData = require('form-data');
const Mailgun = require('mailgun.js');

@Injectable()
export class MailgunService {
  private mg;

  constructor(
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
  ) {
    const mailgun = new Mailgun(formData);
    this.mg = mailgun.client({
      username: 'api',
      key: this.appConfig.mailgun.apiKey,
    });
  }

  public async send(mailInput: IMailgunMailInput) {
    return this.mg.messages.create(this.appConfig.mailgun.domain, {
      ...mailInput,
    });
  }
}
