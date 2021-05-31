import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RABBIT_MQ } from './core/injectionTokens';
import { Message } from '../message.event';

@Controller('hi')
export class AppController {
  /*  constructor(@Inject(RABBIT_MQ) private readonly client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  @Get('/me')
  getMe() {
    return 'Hi there';
  }

  @Get('/hello')
  getHello() {
    this.client.emit<any>('message_printed', new Message('Hello World'));
    return 'Hello World printed';
  }*/
}
