export interface IMailgunAttachment {
  filename: string;
  data: any;
}

export interface IMailgunMailInput {
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string;
  bcc?: string;
  attachment?: IMailgunAttachment | IMailgunAttachment[];
}
