import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/ports/user.repository';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { CredentialRegister, User } from '../../domain/types/auth.types';
import { DocumentType } from '@prisma/client';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepositoryPrismaAdapter extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { email, deletedAt: null } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async create(data: CredentialRegister): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        documentType: DocumentType[data.documentType as keyof typeof DocumentType],
      },
    });
    return UserMapper.toDomain(user);
  }

  async addSession(userId: string, token: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: token,
      },
    });
  }

  async removeSession(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: null,
      },
    });
  }
}
