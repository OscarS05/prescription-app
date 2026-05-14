import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user.repository';
import { HashService } from '../../../domain/ports/hash.service';
import { EmailAlreadyInUseError } from '../../../domain/errors/auth.errors';
import { CredentialRegister, SessionResponse } from '../../../domain/types/auth.types';
import { SessionManagerService } from '../../services/session-manager/session-manager.service';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly sessionManagerService: SessionManagerService,
    private readonly hashService: HashService,
    private readonly usersRepo: UserRepository,
  ) {}

  public async execute(data: CredentialRegister): Promise<SessionResponse> {
    const user = await this.usersRepo.findByEmail(data.email);
    if (user) throw new EmailAlreadyInUseError();

    const hashedPassword = await this.hashService.hash(data.password);
    const newUser = await this.usersRepo.create({
      ...data,
      password: hashedPassword,
    });

    return this.sessionManagerService.GenerateSession({
      sub: newUser.id,
      role: newUser.role,
    });
  }
}
