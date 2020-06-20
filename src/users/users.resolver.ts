import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver()
export class UsersResolver {
  constructor(private readonly userS: UsersService) {}

  @Query(() => [User])
  async users() {
    return this.userS.findAll();
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserDto) {
    return this.userS.create(input);
  }
}
