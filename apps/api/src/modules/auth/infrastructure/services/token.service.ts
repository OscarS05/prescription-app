import { Injectable } from '@nestjs/common';
import { PayloadToken } from '../../domain/types/auth.types';
import { TokenService } from '../../domain/ports/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenError } from '../../domain/errors/auth.errors';

@Injectable()
export class TokenServiceAdapter extends TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async generateAccessToken(payload: PayloadToken): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TTL'),
    });
  }

  async generateRefreshToken(payload: PayloadToken): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TTL'),
    });
  }

  async verifyAccessToken(token: string): Promise<PayloadToken> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
    } catch (error) {
      throw new InvalidTokenError((error as Error).message || 'Invalid token');
    }
  }

  async verifyRefreshToken(token: string): Promise<PayloadToken> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new InvalidTokenError((error as Error).message || 'Invalid token');
    }
  }
}
