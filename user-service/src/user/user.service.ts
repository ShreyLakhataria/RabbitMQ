import { Injectable } from '@nestjs/common';
import { User } from './schema/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private users: User[] = [];
  private idCounter = 1;

  constructor(private jwtService: JwtService) {}

  async register(username: string, email: string, password: string): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const user: User = { id: this.idCounter++, username, email, password: hashed };
    this.users.push(user);
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
    
  }

  async login(user: User): Promise<string> {
    return this.jwtService.sign({ sub: user.id, username: user.username, email: user.email });
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify(token);
      return this.users.find(u => u.id === payload.sub) || null;
    } catch {
      return null;
    }
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
}
