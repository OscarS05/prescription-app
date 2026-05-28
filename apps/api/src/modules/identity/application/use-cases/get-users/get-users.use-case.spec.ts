/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/unbound-method */
import { GetUsersUseCase } from './get-users.use-case';
import { UserRepository } from '../../../domain/ports/user.repository';
import { User, UserQueryParams } from '../../../domain/types/auth.types';
import { UserRole } from '../../../../../shared/domain/enums/roles.enum';

describe('GetUsersUseCase', () => {
  let useCase: GetUsersUseCase;
  let usersRepository: jest.Mocked<UserRepository>;

  const mockUsers: User[] = [
    {
      id: '1',
      email: 'test1@test.com',
      role: UserRole.PATIENT,
      password: 'hashed',
      documentType: 'cc',
      documentNumber: '123',
      refreshTokenHash: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  beforeEach(() => {
    usersRepository = {
      findAll: jest.fn(),
    } as any;

    useCase = new GetUsersUseCase(usersRepository);
  });

  it('should return a paginated list of users (happy path)', async () => {
    usersRepository.findAll.mockResolvedValue([mockUsers, 10]);

    const query: UserQueryParams = {
      limit: 10,
      page: 1,
      query: 'test',
      order: 'DESC',
      roles: [UserRole.DOCTOR],
    };

    const result = await useCase.execute(query);

    expect(usersRepository.findAll).toHaveBeenCalledTimes(1);
    expect(usersRepository.findAll).toHaveBeenCalledWith({
      limit: 10,
      offset: 0,
      query: 'test',
      order: 'DESC',
      roles: [UserRole.DOCTOR],
    });

    expect(result).toEqual({
      data: mockUsers,
      page: 1,
      limit: 10,
      total: 10,
      hasNextPage: false,
    });
  });

  it('should return empty list when no users exist', async () => {
    usersRepository.findAll.mockResolvedValue([[], 0]);

    const query: UserQueryParams = {
      limit: 10,
      page: 1,
      query: '',
      roles: [UserRole.DOCTOR],
      order: 'DESC',
    };

    const result = await useCase.execute(query);

    expect(usersRepository.findAll).toHaveBeenCalledWith({
      limit: 10,
      offset: 0,
      query: '',
      order: 'DESC',
      roles: [UserRole.DOCTOR],
    });

    expect(result).toEqual({
      data: [],
      page: 1,
      limit: 10,
      total: 0,
      hasNextPage: false,
    });
  });

  it('should cap limit to 15', async () => {
    usersRepository.findAll.mockResolvedValue([[], 0]);

    const query: UserQueryParams = {
      limit: 100,
      page: 1,
      query: '',
      roles: [UserRole.DOCTOR],
      order: 'DESC',
    };

    await useCase.execute(query);

    expect(usersRepository.findAll).toHaveBeenCalledWith({
      limit: 15,
      offset: 0,
      query: '',
      order: 'DESC',
      roles: [UserRole.DOCTOR],
    });
  });

  it('should calculate offset correctly', async () => {
    usersRepository.findAll.mockResolvedValue([[], 0]);

    const query: UserQueryParams = {
      limit: 10,
      page: 3,
      query: '',
      roles: [UserRole.DOCTOR],
      order: 'DESC',
    };

    await useCase.execute(query);

    expect(usersRepository.findAll).toHaveBeenCalledWith({
      limit: 10,
      offset: 20,
      query: '',
      order: 'DESC',
      roles: [UserRole.DOCTOR],
    });
  });

  it('should correctly compute hasNextPage when more results exist', async () => {
    usersRepository.findAll.mockResolvedValue([mockUsers, 50]);

    const query: UserQueryParams = {
      limit: 10,
      page: 1,
      query: '',
      roles: [UserRole.DOCTOR],
      order: 'DESC',
    };

    const result = await useCase.execute(query);

    expect(result.hasNextPage).toBe(true);
  });
});
