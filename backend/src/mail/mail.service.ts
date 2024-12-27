import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Account } from 'account/entities/account.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendOrderConfirmation({
    account,
    email,
    subject,
    template,
    context,
    html,
    attachments,
    text,
  }: {
    account: Account;
    email: string;
    subject: string;
    template: string;
    context?: Record<string, any>;
    html?: any;
    attachments?: any;
    text?: string;
  }) {
   // const templatePath = path.resolve(__dirname, 'templates', template);
    const response = await this.mailService.sendMail({
      from: `<mygreenmarketinfo@gmail.com>`,
      to: email.toLowerCase(),
      subject: subject,
      html,
      attachments: attachments
        ? [
            {
              filename: 'report.xlsx',
              content: attachments,
              encoding: 'base64',
            },
          ]
        : [],
      context,
      text,
    });
    
    return response;
  }
}
