import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';

@InputType()
export class UserInput {
  @Field()
  @IsString()
  @MinLength(3)
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsUUID()
  id: string;
}