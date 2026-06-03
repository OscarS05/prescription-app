import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/ports/user.repository';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { CredentialRegister, User, UserQueryFilters } from '../../domain/types/auth.types';
import { DocumentType, Prisma, UserRole } from '@prisma/client';
import { UserMapper } from '../mappers/user.mapper';
import { AdminMetricsRequest, TotalUserMetrics } from '../../domain/types/admin.types';

@Injectable()
export class UserRepositoryPrismaAdapter extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(query: UserQueryFilters): Promise<[User[], number]> {
    const { offset, limit, query: search, roles, order } = query;

    const where = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              {
                email: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                documentNumber: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
      ...(roles && roles.length > 0
        ? {
            role: {
              in: roles,
            },
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: order === 'DESC' ? 'desc' : 'asc',
        },
      }),
      this.prisma.user.count({
        where,
      }),
    ]);

    return [users.map((u) => UserMapper.toDomain(u)), total];
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { doctor: true, patient: true },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: { doctor: true, patient: true },
    });
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

  async getMetrics(filters: AdminMetricsRequest): Promise<TotalUserMetrics> {
    const { from, to } = filters;

    const [doctors, patients, newPatients] = await Promise.all([
      this.prisma.user.count({
        where: {
          role: UserRole.doctor,
          deletedAt: null,
        },
      }),
      this.prisma.user.count({
        where: {
          role: UserRole.patient,
          deletedAt: null,
        },
      }),
      this.prisma.user.count({
        where: {
          role: UserRole.patient,
          createdAt: {
            gte: from,
            lte: to,
          },
          deletedAt: null,
        },
      }),
    ]);

    return {
      doctors,
      patients,
      newPatients,
    };
  }
}
