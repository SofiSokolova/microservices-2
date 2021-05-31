import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPair, TokenPayload } from '../auth/types';
import { CacheService } from '../services/cache/cache.service';
import { AuthTokensInterface, Config } from '../core/config';
import { CONFIRM_TOKEN_KEY, DAY, DAY_IN_MILLISECONDS } from '../core/constants';

@Injectable()
export class TokenService {
  constructor(
    private cacheService: CacheService,
    private config: Config,
    private jwtService: JwtService,
  ) {}

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.verifyCachedToken(token, this.config.auth.accessToken);
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.verifyCachedToken(token, this.config.auth.refreshToken);
  }

  async verifyConfirmToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verify(token, {
      secret: this.config.auth.confirmToken.secret,
    });
  }

  async findTokenByKey(key: string): Promise<string> {
    return this.cacheService.get(key);
  }

  async deleteTokenByKey(key: string): Promise<void> {
    await this.cacheService.del(key);
  }

  async signTokenPair(payload: TokenPayload): Promise<TokenPair> {
    const { accessToken: accessTokenConfig, refreshToken: refreshTokenConfig } =
      this.config.auth;

    const accessToken = await this.signTokenWithCache(
      payload,
      accessTokenConfig,
    );

    const refreshToken = await this.signTokenWithCache(
      payload,
      refreshTokenConfig,
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async verifyCachedToken(
    token: string,
    tokenConfig: AuthTokensInterface,
  ): Promise<TokenPayload> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: tokenConfig.secret,
    });

    const cachedToken = await this.cacheService.get(
      tokenConfig.getCacheKey(payload.id),
    );

    if (cachedToken !== token) {
      throw new Error('JWT error: tokens don`t not match');
    }

    return payload;
  }

  async getTokenConfirm(
    email: string,
    config: AuthTokensInterface,
  ): Promise<string> {
    console.log('can you pls told me why im here');
    console.log({
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
    const token = await this.jwtService.signAsync(
      { email },
      {
        secret: config.secret,
        expiresIn: config.expiresIn,
      },
    );
    await this.cacheService.set(
      `${email}${CONFIRM_TOKEN_KEY}`,
      token,
      DAY_IN_MILLISECONDS, //@TODO i'll fix it later mb
    );

    return token;
  }

  /*  async setToken(
    token: string,
    key: string,
    expInTime: number,
  ): Promise<string> {
    await this.cacheService.set(key, token, expInTime);

    return this.findTokenByKey(key);
  }*/

  private async signTokenWithCache(
    payload: TokenPayload,
    config: AuthTokensInterface,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });

    await this.cacheService.set(
      config.getCacheKey(payload.id),
      token,
      config.expiresIn,
    );

    return token;
  }
}
