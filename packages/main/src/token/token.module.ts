import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { JwtModule } from '@nestjs/jwt';
import { CacheService } from '../services/cache/cache.service';
import { HashService } from '../services/hash/hash.service';
import { TokenService } from './token.service';

@Module({
  imports: [CoreModule, JwtModule.register({})],
  controllers: [],
  providers: [CacheService, HashService, TokenService],
  exports: [TokenService, JwtModule],
})
export class TokenModule {}
