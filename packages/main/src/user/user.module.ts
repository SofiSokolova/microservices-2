import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { HashService } from '../services/hash/hash.service';
import { CoreModule } from '../core/core.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RABBIT_MQ } from '../core/injectionTokens';

@Module({
  imports: [
    CoreModule,
    SequelizeModule.forFeature([UserModel]),
    /*ClientsModule.register([
      {
        name: RABBIT_MQ,
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://guest:guest@localhost:5672`],
          queue: 'email_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),*/
    /*    ClientsModule.register([
      {
        name: RABBIT_MQ,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${configInstance.rabbitmq.user}:${configInstance.rabbitmq.password}@${configInstance.rabbitmq.host}`,
          ],
          queue: configInstance.rabbitmq.queueName,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),*/
  ],
  controllers: [UserController],
  providers: [UserService, HashService],
  exports: [UserService],
})
export class UserModule {}
