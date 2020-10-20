import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailService } from './services/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { SenderConsumer } from './consumers/send.consumer';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          ignoreTLS: true,
          secure: false,
        },
        preview: true,
        defaults: {
          from: config.get('APP_NAME') + '<' + config.get('MAIL_FROM') + '>',
        },
        template: {
          dir: __dirname + '/../../templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: __dirname + '/../../templates/partials',
            options: {
              strict: true,
            },
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'email',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis:
          configService.get('QUEUE_HOST') +
          ':' +
          configService.get('QUEUE_PORT'),
        defaultJobOptions: {
          removeOnFail: false,
          removeOnComplete: true,
        },
        settings: {
          lockDuration: 300000,
        },
      }),
    }),
    CqrsModule,
  ],
  exports: [MailService],
  providers: [MailService, SenderConsumer],
})
export class MailModule {}
