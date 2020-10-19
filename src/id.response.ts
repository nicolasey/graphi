import { ObjectType, Field } from "@nestjs/graphql";
import { IsUUID } from 'class-validator';

@ObjectType()
export class IdResponse {
    @Field()
    @IsUUID()
    id!: string;
}
