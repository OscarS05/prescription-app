import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user.repository';
import { HashService } from '../../../domain/ports/hash.service';
import { InvalidSessionError, DomainNotFoundError } from '../../../domain/errors/auth.errors';
import { PaylodToken, SessionResponse } from '../../../domain/types/auth.types';
import { SessionManagerService } from '../../services/session-manager/session-manager.service';

@Injectable()
export class RefreshSessionUseCase {
  constructor(
    private readonly sessionManagerService: SessionManagerService,
    private readonly hashService: HashService,
    private readonly usersRepo: UserRepository,
  ) {}

  public async execute(payload: PaylodToken, token: string): Promise<SessionResponse> {
    const user = await this.usersRepo.findById(payload.sub);
    if (!user) throw new DomainNotFoundError();
    if (!user.refreshTokenHash) throw new InvalidSessionError();

    const isValidToken = await this.hashService.compare(token, user.refreshTokenHash);
    if (!isValidToken) throw new InvalidSessionError();

    return this.sessionManagerService.GenerateSession(payload);
  }
}
