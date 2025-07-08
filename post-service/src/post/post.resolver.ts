import { Resolver, Mutation, Args, Query, Context, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './schema/post.entity';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Mutation(() => Post)
  async createPost(
    @Args('input') input: CreatePostInput,
    @Context() ctx
  ) {
    const auth = ctx.req.headers.authorization;
    if (!auth) throw new Error('No token');
    const token = auth.replace('Bearer ', '');
    const user = await this.postService.validateUser(token);
    if (!user) throw new Error('Invalid token');
    return this.postService.createPost(input.title, input.content, user);
  }

  @Query(() => [Post])
  getPosts() {
    return this.postService.getPosts();
  }

  @Query(() => Post, { nullable: true })
  getPostById(@Args('id', { type: () => Int }) id: number) {
    return this.postService.getPostById(id);
  }
}
