import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user.repository';
import { UserInfo } from '../../../domain/types/auth.types';
import { DomainNotFoundError } from '../../../domain/errors/auth.errors';

@Injectable()
export class GetUserInfoUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<UserInfo> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new DomainNotFoundError();

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      documentType: user.documentType,
      documentNumber: user.documentNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      doctor: user.doctor,
      patient: user.patient,
    };
  }
}
