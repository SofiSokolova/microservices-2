import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from '../core/types';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { UserCreateDto } from '../user/dto/user-create.dto';
import { ConfirmTokenDto } from './dto/confirm-token.dto';
import { RABBIT_MQ } from '../core/injectionTokens';
import { ClientProxy } from '@nestjs/microservices';
import { Message } from '../../message.event';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(RABBIT_MQ)
    private client: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  @Get('/test')
  getHello() {
    this.client.emit<any>('message_printed', new Message('Hello World'));
    return 'Hello World printed';
  }

  @Post('/signup')
  @ApiResponse({
    schema: {
      example: {
        status: 'ok',
        response: {},
      },
    },
    status: 201,
  })
  async create(@Body() userDTO: UserCreateDto) {
    await this.authService.signup(userDTO);
  }

  @Post('confirm/email')
  async confirmEmail(@Body() confirmToken: ConfirmTokenDto) {
    await this.authService.confirmEmail(confirmToken);
  }

  @Post('/login')
  @ApiResponse({
    schema: {
      example: {
        status: 'ok',
        response: {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      },
    },
    status: 201,
  })
  @ApiResponse({
    schema: {
      example: {
        response: {
          statusCode: 401,
          message: 'Wrong password',
          error: 'Unauthorized',
        },
        status: 401,
        message: 'Wrong password',
      },
    },
    status: 401,
  })
  async login(@Body() loginDto: LoginDto) {
    const tokenPair = await this.authService.login(loginDto);
    return Response.ok(tokenPair);
  }

  @Post('/refresh')
  @ApiResponse({
    schema: {
      example: {
        status: 'ok',
        response: {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      },
    },
    status: 201,
  })
  async refreshTokens(
    @Body() { refreshToken }: RefreshTokensDto,
  ): Promise<Response> {
    const tokenPair = await this.authService.refreshTokens(refreshToken);
    return Response.ok(tokenPair);
  }

  @Post('/test')
  async test(): Promise<string> {
    return 'This action returns all cats';
  }
}
