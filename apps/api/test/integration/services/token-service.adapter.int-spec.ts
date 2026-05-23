import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { TokenServiceAdapter } from '../../../src/modules/identity/infrastructure/services/token.service';
import { UserRole } from '../../../src/shared/domain/enums/roles.enum';

describe('TokenServiceAdapter Integration', () => {
  let service: TokenServiceAdapter;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              JWT_ACCESS_SECRET: 'access-secret',
              JWT_REFRESH_SECRET: 'refresh-secret',
              JWT_ACCESS_TTL: '15m',
              JWT_REFRESH_TTL: '7d',
            }),
          ],
        }),
        JwtModule.register({}),
      ],
      providers: [TokenServiceAdapter],
    }).compile();

    service = module.get(TokenServiceAdapter);
  });

  it('should generate and verify access token', async () => {
    const token = await service.generateAccessToken({
      sub: '1',
      role: UserRole.ADMIN,
    });

    const payload = await service.verifyAccessToken(token);

    expect(payload.sub).toBe('1');
  });

  it('should generate and verify refresh token', async () => {
    const token = await service.generateRefreshToken({
      sub: '1',
      role: UserRole.ADMIN,
    });

    const payload = await service.verifyRefreshToken(token);

    expect(payload.sub).toBe('1');
  });
});
