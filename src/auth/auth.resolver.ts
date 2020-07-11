import { Resolver, Args, Query } from '@nestjs/graphql';
import { AuthSuccess } from './interfaces/auth-success.output';
import { LoginInput } from './interfaces/login.input';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(private auth: AuthService) {}

  @Query(() => AuthSuccess)
  async login(@Args('input') input: LoginInput) {
    return await this.auth.login(input);
  }
}
