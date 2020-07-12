import { Resolver, Args, Query, Context } from '@nestjs/graphql';
import { AuthSuccess } from './interfaces/auth-success.output';
import { LoginInput } from './interfaces/login.input';
import { AuthService } from './auth.service';
import { User } from '../users/user.schema';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Resolver('Auth')
export class AuthResolver {
  constructor(private auth: AuthService) {}

  @Query(() => AuthSuccess)
  async login(@Args('input') input: LoginInput) {
    return await this.auth.login(input);
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  async me(@Context('user') user: User) {
    return user;
  }
}
