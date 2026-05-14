import { User as UserORM } from '@prisma/client';
import { User as UserEntity } from '../../domain/types/auth.types';
import { UserRole } from '../../domain/enums/roles.enum';

export class UserMapper {
  static toDomain(orm: UserORM): UserEntity {
    return {
      id: orm.id,
      role: UserRole[orm.role as keyof typeof UserRole],
      email: orm.email,
      password: orm.password,
      documentType: orm.documentType as UserEntity['documentType'],
      documentNumber: orm.documentNumber,
      refreshTokenHash: orm.refreshTokenHash || null,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt || null,
    };
  }
}
