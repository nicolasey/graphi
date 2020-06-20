import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
  constructor() //private authorsService: AuthorsService,
  //private postsService: PostsService,
  {}

  @Query(() => String)
  async helloWorld() {
    return 'hello there';
  }
}
