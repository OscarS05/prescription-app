import { Injectable } from '@nestjs/common';
import { TokenService } from '../../../domain/ports/token.service';
import { UserRepository } from '../../../domain/ports/user.repository';
import { HashService } from '../../../domain/ports/hash.service';
import { PaylodToken, SessionResponse } from '../../../domain/types/auth.types';

@Injectable()
export class SessionManagerService {
  constructor(
    private readonly tokensService: TokenService,
    private readonly hashService: HashService,
    private readonly usersRepo: UserRepository,
  ) {}

  public async GenerateSession(payload: PaylodToken): Promise<SessionResponse> {
    const refreshToken = await this.tokensService.generateRefreshToken(payload);
    const hashedToken = await this.hashService.hash(refreshToken);
    await this.usersRepo.addSession(payload.sub, hashedToken);

    return {
      refreshToken,
      accessToken: await this.tokensService.generateAccessToken(payload),
    };
  }
}
