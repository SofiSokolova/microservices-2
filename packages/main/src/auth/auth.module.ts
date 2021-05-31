import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CacheService } from '../services/cache/cache.service';
import { CoreModule } from '../core/core.module';
import { UserModule } from '../user/user.module';
import { HashService } from '../services/hash/hash.service';
import { TokenModule } from '../token/token.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RABBIT_MQ } from '../core/injectionTokens';

@Module({
  imports: [
    CoreModule,
    UserModule,
    TokenModule,
    ClientsModule.register([
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
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, CacheService, HashService],
  exports: [AuthService],
})
export class AuthModule {}
