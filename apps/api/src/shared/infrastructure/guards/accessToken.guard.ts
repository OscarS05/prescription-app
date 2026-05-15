import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../../../modules/identity/domain/ports/token.service';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from './http.type';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.accessToken as string;
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.tokenService.verifyAccessToken(token);

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
