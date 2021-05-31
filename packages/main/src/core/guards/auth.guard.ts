import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Config } from '../config';
import { AuthService } from '../../auth/auth.service';
import { ROLE_DECORATOR_METADATA_KEY } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private config: Config,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (this.isUnprotectedRoute(req.url)) {
      return true;
    }
    const token = req.header('authorization');

    if (!token) {
      throw new Error('No token provided');
    }

    try {
      req.account = await this.authService.isAuthenticated(
        token.replace('Bearer ', ''),
      );

      const roles = this.reflector.get<string[]>(
        ROLE_DECORATOR_METADATA_KEY,
        context.getHandler(),
      );

      if (roles && !roles.includes(req.account.role)) {
        throw new ForbiddenException('You are not allowed to use this route');
      }

      return req.account?.email && req.account?.id;
    } catch (exception) {
      throw new UnauthorizedException(exception);
    }
  }

  private isUnprotectedRoute(url: string): boolean {
    return this.config.unprotectedRoutes.includes(url);
  }
}
