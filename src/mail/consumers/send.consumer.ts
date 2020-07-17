import {
  Processor,
  Process,
  OnQueueError,
  OnQueueCompleted,
} from '@nestjs/bull';
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
    await this.mailS
      .sendMail({
        to: job.data.to,
        from: this.config.get('MAIL_FROM'),
        subject: job.data.subject,
        template: job.data.template,
        context: job.data.context,
      })
      .then(() => Logger.log('Mail sent to ' + job.data.to, 'Mail Consumer'))
      .catch(err => Logger.error(err, 'Mail Consumer'));
  }

  @OnQueueError()
  handler(error: Error) {
    Logger.error(error.message, 'Mail Queue');
  }

  @OnQueueCompleted()
  completed(job: Job<MailInterface>, result: any) {
    Logger.log(
      'Mail ' + job.data.template + ' completed for ' + job.data.to,
      'Mail Queue',
    );
  }
}
