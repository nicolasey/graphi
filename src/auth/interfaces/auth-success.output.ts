import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '../../users/user.schema';

@ObjectType()
export class AuthSuccess {
  constructor(token: string, user: User) {
    this.token = token;
    this.user = user;
  }

  @IsString()
  @Field()
  token: string;

  @Field(type => User)
  user: User;
}
