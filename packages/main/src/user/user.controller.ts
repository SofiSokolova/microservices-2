import { Controller, Get, Inject, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUserInfo, Response } from '../core/types';
import { RABBIT_MQ } from '../core/injectionTokens';
import { ClientProxy } from '@nestjs/microservices';
import { Message } from '../../message.event';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {} /*    @Inject(RABBIT_MQ)
    private client: ClientProxy,*/

  async onApplicationBootstrap() {
    //await this.client.connect();
  }

  /*  @Get('/test')
  getHello() {
    this.client.emit<any>('message_printed', new Message('Hello World'));
    return 'Hello World printed';
  }*/

  @Get('/me')
  @ApiBearerAuth()
  @ApiResponse({
    schema: {
      example: {
        status: 'ok',
        response: {
          id: 6,
          email: 'sofiia.sokolova.dev@gmail.com',
          createdAt: '2021-03-15T00:09:11.281Z',
        },
      },
    },
    status: 201,
  })
  async getMyself(
    @Req() { account: { id } }: RequestWithUserInfo,
  ): Promise<Response> {
    const user = await this.userService.findById(id);
    return Response.ok(user);
  }
}
