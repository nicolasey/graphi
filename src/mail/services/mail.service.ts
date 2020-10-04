import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MailInterface } from '../interfaces/mail.interface';

@Injectable()
export class MailService {
  constructor(@InjectQueue('email') private mailQueue: Queue) {}

  async sendMail(mailData: MailInterface) {
    await this.mailQueue
      .add(mailData, {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: false,
      })
      .then(() => Logger.log('Mail queued for ' + mailData.to, 'Mail Queue'))
      .catch(err => Logger.error(err, 'Queueing email'));
  }
}
