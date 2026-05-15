import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user.repository';
import { HashService } from '../../../domain/ports/hash.service';
import {
  DomainNotFoundError,
  InvalidCredentialsError,
} from '../../../domain/errors/auth.errors';
import { Credentials, UserResponse } from '../../../domain/types/auth.types';
import { SessionManagerService } from '../../services/session-manager/session-manager.service';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly sessionManagerService: SessionManagerService,
    private readonly hashService: HashService,
    private readonly usersRepo: UserRepository,
  ) {}

  public async execute(credentials: Credentials): Promise<UserResponse> {
    const user = await this.usersRepo.findByEmail(credentials.email);
    if (!user) throw new DomainNotFoundError();

    const isPasswordValid = await this.hashService.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) throw new InvalidCredentialsError();

    return {
      tokens: await this.sessionManagerService.GenerateSession({
        sub: user.id,
        role: user.role,
      }),
      user: user,
    };
  }
}
