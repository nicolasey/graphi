import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UsersService } from './users.service';
import { MailModule } from '../mail/mail.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ValidateUserHandler } from './listeners/validation.handler';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(require('mongoose-slug-plugin'), { tmpl: '<%=name%>' });
          return schema;
        },
      },
    ]),
    CqrsModule,
    MailModule,
  ],
  providers: [UsersResolver, UsersService, ValidateUserHandler],
  exports: [UsersService],
})
export class UsersModule {}
