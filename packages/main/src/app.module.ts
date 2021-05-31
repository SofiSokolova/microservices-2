import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoreModule } from './core/core.module';
import { Config, configInstance } from './core/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { AuthGuard } from './core/guards/auth.guard';
import { CustomExceptionFilter } from './core/filters/exception.filter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RABBIT_MQ } from './core/injectionTokens';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UserModule,
    SequelizeModule.forRoot({
      dialect: configInstance.db.dialect,
      host: configInstance.db.host,
      port: configInstance.db.port,
      username: configInstance.db.user,
      password: configInstance.db.password,
      database: configInstance.db.dbName,
      autoLoadModels: true,
      logging: false,
    }),
    /*    ClientsModule.register([
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
    TokenModule,
  ],
  //controllers: [EmailController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    /*    {
      provide: RABBIT_MQ,
      useFactory: (config: Config) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${config.rabbitmq.user}:${config.rabbitmq.password}@${config.rabbitmq.host}`,
            ],
            queue: config.rabbitmq.queueName,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [Config],
    },*/
  ],
})
export class AppModule {}
