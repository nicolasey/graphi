import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
