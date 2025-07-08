import { Injectable } from '@nestjs/common';
import { Post } from './schema/post.entity';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class PostService {
  private posts: Post[] = [];
  private idCounter = 1;
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'user_queue',
        queueOptions: { durable: false },
      },
    });
  }

  async validateUser(token: string): Promise<any> {
    console.log('[PostService] Sending validate_user for token:', token);
    const user = await this.client.send('validate_user', { token }).toPromise(); //sending 
    console.log('[PostService] Received user from UserService:', user);
    return user;
  }

  async createPost(title: string, content: string, user: any): Promise<Post> {
    console.log('[PostService] Creating post for user:', user);
    const post: Post = {
      id: this.idCounter++,
      title,
      content,
      createdByUserId: user.id,
      createdByUsername: user.username,
    };
    this.posts.push(post);
    return post;
  }

  getPosts(): Post[] {
    return this.posts;
  }

  getPostById(id: number): Post | undefined {
    return this.posts.find(p => p.id === id);
  }
}
