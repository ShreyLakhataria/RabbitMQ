import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { User } from './schema/user.entity';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => String)
  async register(@Args('input') input: RegisterInput) {
    const user = await this.userService.register(input.username, input.email, input.password);
    return this.userService.login(user);
  }

  @Mutation(() => String)
  async login(@Args('input') input: LoginInput) {
    const user = await this.userService.validateUser(input.email, input.password);
    if (!user) throw new Error('Invalid credentials');
    return this.userService.login(user);
  }

  @Query(() => User, { nullable: true })
  async me(@Context() ctx) {
    const auth = ctx.req.headers.authorization;
    if (!auth) return null;
    const token = auth.replace('Bearer ', '');
    return this.userService.verifyToken(token);
  }
}
