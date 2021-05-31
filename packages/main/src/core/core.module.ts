import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { Config, configInstance } from './config';
import { EMAIL_TRANSPORTER, RABBIT_MQ, REDIS } from './injectionTokens';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

const customProviders = [
  {
    provide: Config,
    useValue: configInstance,
  },
  {
    provide: REDIS,
    useFactory: (config: Config) => {
      const { host, port } = config.redis;
      return new Redis(port, host);
    },
    inject: [Config],
  },
  {
    provide: EMAIL_TRANSPORTER,
    useFactory: (config: Config) => {
      return nodemailer.createTransport(smtpTransport(config.email));
    },
    inject: [Config],
  },
];

@Module({
  providers: [...customProviders],
  exports: [...customProviders],
})
export class CoreModule {}
