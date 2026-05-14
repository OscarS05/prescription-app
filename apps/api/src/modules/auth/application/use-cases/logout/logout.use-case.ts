import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user.repository';
import { PaylodToken } from '../../../domain/types/auth.types';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly usersRepo: UserRepository) {}

  public async execute(payload: PaylodToken): Promise<void> {
    await this.usersRepo.removeSession(payload.sub);
  }
}
