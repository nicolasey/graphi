import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { isDate } from 'class-validator';

@ObjectType()
@Schema()
export class User extends Document {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop()
  slug: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ nullable: true })
  password?: string;

  @Prop({ nullable: true })
  validationCode: string;

  @Field({ nullable: true })
  @Prop({ nullable: true })
  validatedAt: Date;

  get isValidated(): boolean {
    return !!this.validatedAt && isDate(this.validatedAt);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
