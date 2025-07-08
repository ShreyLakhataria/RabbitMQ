import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern('validate_user')
  async handleValidateUser(@Payload() data: { token: string }) {
    console.log('[UserService] Received validate_user for token:', data.token);
    const user = await this.userService.verifyToken(data.token);
    console.log('[UserService] Validation result:', user);
    return user;
  }
}
