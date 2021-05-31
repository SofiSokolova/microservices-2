import { HttpStatus } from '@nestjs/common';
import { TokenPayload } from '../auth/types';

export class Response {
  status: 'ok' | 'error';

  response?: any;

  message?: string | string[];

  static ok<T extends Response, P>(response?: P): T {
    return this.createResponse<T, P>('ok', response);
  }

  static error<T extends Response, P, E>(
    message?: string | string[],
    statusCode?: HttpStatus | number,
    response?: P,
  ): T {
    return this.createResponse<T, P>('error', response, message);
  }

  private static createResponse<T extends Response, P>(
    status: 'ok' | 'error',
    response = {},
    message?: string | string[],
  ): any {
    return {
      status,
      response,
      message,
    };
  }
}

export interface RequestWithUserInfo extends Request {
  account: TokenPayload;
}

export enum SQLDialects {
  POSTGRES = 'postgres',
}
