import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailInterface } from '../interfaces/mail.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Processor('email')
export class SenderConsumer {
  constructor(
    private mailS: MailerService,
    private readonly config: ConfigService,
  ) {}

  @Process()
  async send(job: Job<MailInterface>) {
    this.mailS
      .sendMail({
        to: job.data.to,
        from: this.config.get('MAIL_FROM'),
        subject: job.data.subject,
        template: job.data.template,
        context: job.data.context,
      })
      .then(() => Logger.log('Mail sent for ' + job.data.to, 'Mail Queue'));
  }
}
