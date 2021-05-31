import { NestFactory } from '@nestjs/core';
import { EmailModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmailModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://guest:guest@localhost:5672`],
        queue: 'email_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  /*  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqps://lpnghiug:YiPvdvEvFyN16g6ltWxsYATplQICgljh@beaver.rmq.cloudamqp.com/lpnghiug`,
        ],
        queue: 'lol',
        queueOptions: {
          durable: false,
        },
      },
    },
  );*/
  await app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
