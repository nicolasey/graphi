import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { CreateUserDto } from './inputs/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserInput } from './inputs/user.input';
import { IdResponse } from '../id.response';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly userS: UsersService) {}

  @Query(() => [User])
  @UseGuards(AuthGuard)
  async users() {
    return await this.userS.findAll();
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserDto) {
    return await this.userS.create(input);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async validateUser(
    @Args('id') id: string,
    @Args('validationCode') validationCode: string,
  ) {
    return await this.userS.validate(id, validationCode);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updateUser(@Args('user') user: UserInput) {
    return await this.userS.update(user).then(
      (res) => {return user;} 
    );
  }

  @Mutation(() => IdResponse)
  @UseGuards(AuthGuard)
  async deleteUser(@Args('id') id: string) {
    return await this.userS.delete(id).then(() => {return { id } as IdResponse});
  }
}
