import { Test, TestingModule } from '@nestjs/testing';

import { GetUserInfoUseCase } from './get-user-info.use-case';

import { UserRepository } from '../../../domain/ports/user.repository';
import { DomainNotFoundError } from '../../../domain/errors/auth.errors';
import { UserRole } from '../../../../../shared/domain/enums/roles.enum';

describe('GetUserInfoUseCase', () => {
  let useCase: GetUserInfoUseCase;

  const userRepositoryMock = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserInfoUseCase,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get(GetUserInfoUseCase);

    jest.clearAllMocks();
  });

  it('should return user info successfully', async () => {
    const now = new Date();

    userRepositoryMock.findById.mockResolvedValue({
      id: 'user-id',
      email: 'test@test.com',
      role: UserRole.ADMIN,
      documentType: 'cc',
      documentNumber: '123456',
      createdAt: now,
      updatedAt: now,
      doctor: null,
      patient: null,
    });

    const result = await useCase.execute('user-id');

    expect(userRepositoryMock.findById).toHaveBeenCalledWith('user-id');

    expect(result).toEqual({
      id: 'user-id',
      email: 'test@test.com',
      role: UserRole.ADMIN,
      documentType: 'cc',
      documentNumber: '123456',
      createdAt: now,
      updatedAt: now,
      doctor: null,
      patient: null,
    });
  });

  it('should throw DomainNotFoundError if user does not exist', async () => {
    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(DomainNotFoundError);

    expect(userRepositoryMock.findById).toHaveBeenCalledWith('invalid-id');
  });
});
