import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../../../modules/identity/domain/ports/token.service';
import { Request } from 'express';
import { AuthenticatedRequest } from './http.type';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const refreshToken = request.cookies?.refreshToken as string;
    if (!refreshToken) throw new UnauthorizedException();

    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
