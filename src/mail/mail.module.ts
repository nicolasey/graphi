import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailService } from './services/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        ignoreTLS: true,
        secure: false,
      },
      defaults: {
        from: '"Alphonse" <no-reply@alphonse.com>',
      },
      template: {
        dir: __dirname + '/../templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: __dirname + '/../templates/partials',
          options: {
            strict: true,
          },
        },
      },
    }),
    BullModule.registerQueueAsync({
      name: 'email',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('QUEUE_HOST'),
          port: +configService.get('QUEUE_PORT'),
        },
      }),
    }),
  ],
  exports: [MailService],
  providers: [MailService],
})
export class MailModule {}
