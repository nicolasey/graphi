import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../events/created.event';
import { MailService } from '../../mail/services/mail.service';
import { Logger } from '@nestjs/common';

@EventsHandler(UserCreatedEvent)
export class ValidateUserHandler implements IEventHandler<UserCreatedEvent> {
  constructor(private readonly mailS: MailService) {}

  handle(event: UserCreatedEvent) {
    try {
      const { name, email, validationCode } = event.user;
      this.mailS.sendMail({
        to: email,
        template: 'validation',
        subject: 'Please validate your email',
        context: { validationCode, name },
      });
    } catch (err) {
      Logger.error(err, 'Email Event');
    }
  }
}
