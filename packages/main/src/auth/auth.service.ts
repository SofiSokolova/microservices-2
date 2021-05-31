import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { CacheService } from '../services/cache/cache.service';
import { Config } from '../core/config';
import { HashService } from '../services/hash/hash.service';
import { TokenPair, TokenPayload } from './types';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { UserScopesEnum } from '../user/types';
import { UserCreateDto } from '../user/dto/user-create.dto';
import { ConfirmTokenDto } from './dto/confirm-token.dto';
import { CONFIRM_TOKEN_KEY } from '../core/constants';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private cacheService: CacheService,
    private config: Config,
    private hashService: HashService,
    private userService: UserService,
  ) {}

  async isAuthenticated(token: string): Promise<TokenPayload> {
    return this.tokenService.verifyAccessToken(token);
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const { id } = await this.tokenService.verifyRefreshToken(refreshToken);

    const { email, role } = await this.userService.findById(
      id,
      UserScopesEnum.LOGIN,
    );

    return this.tokenService.signTokenPair({ id, email, role });
  }

  async login({ email, password }: LoginDto): Promise<TokenPair> {
    const user = await this.userService.findByEmail(
      email,
      UserScopesEnum.LOGIN,
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { id, password: dbPassword, role } = user;

    const passwordsMatch = await this.hashService.compareHashes(
      password,
      dbPassword,
    );

    if (!passwordsMatch) {
      throw new UnauthorizedException('Wrong password');
    }

    return this.tokenService.signTokenPair({
      id,
      email,
      role,
    });
  }

  async signup(user: UserCreateDto): Promise<TokenPair> {
    const { confirmToken: confirmTokenConfig } = this.config.auth;
    const tokenConfirm = await this.tokenService.getTokenConfirm(
      user.email,
      confirmTokenConfig,
    );
    await this.userService.createUser(user, tokenConfirm);
    return;
  }

  async confirmEmail(confirmTokenDto: ConfirmTokenDto): Promise<void> {
    const { confirmToken } = confirmTokenDto;

    const { email } = await this.tokenService.verifyConfirmToken(confirmToken);
    const redisToken = await this.tokenService.findTokenByKey(
      `${email}${CONFIRM_TOKEN_KEY}`,
    );
    if (!redisToken || redisToken !== confirmToken) {
      throw new UnauthorizedException();
    }
    await this.tokenService.deleteTokenByKey(`${email}${CONFIRM_TOKEN_KEY}`);
    const user = await this.userService.findByEmail(email);
    await user.update({ confirmed: true });
  }
}
