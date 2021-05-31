import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { OKReply } from './constants';
import { REDIS } from '../../core/injectionTokens';

@Injectable()
export class CacheService {
  constructor(@Inject(REDIS) private redis: Redis) {}

  async set(
    key: string,
    value: string,
    lifetimeInMillis: number,
    expiryMode = 'PX',
  ): Promise<void> {
    const reply = await this.redis.set(
      key,
      value,
      expiryMode,
      lifetimeInMillis,
    );

    if (reply !== OKReply) {
      throw new Error('Redis error: something went wrong with SET');
    }
  }

  async get(key: string): Promise<string> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
