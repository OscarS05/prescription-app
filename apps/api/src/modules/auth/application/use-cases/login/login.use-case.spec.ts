/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { LoginUseCase } from './login.use-case';
import {
  InvalidCredentialsError,
  DomainNotFoundError,
} from '../../../domain/errors/auth.errors';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  const usersRepo = {
    findByEmail: jest.fn(),
  };

  const hashService = {
    compare: jest.fn(),
  };

  const sessionManagerService = {
    GenerateSession: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new LoginUseCase(
      sessionManagerService as any,
      hashService as any,
      usersRepo as any,
    );
  });

  it('should login successfully', async () => {
    usersRepo.findByEmail.mockResolvedValue({
      id: '1',
      password: 'hashed-password',
      role: 'admin',
    });

    hashService.compare.mockResolvedValue(true);

    sessionManagerService.GenerateSession.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    const result = await useCase.execute({
      email: 'admin@test.com',
      password: 'admin123',
    });

    expect(result).toEqual({
      accessToken: 'access',
      refreshToken: 'refresh',
    });
  });

  it('should throw if user does not exist', async () => {
    usersRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'admin@test.com',
        password: 'admin123',
      }),
    ).rejects.toThrow(DomainNotFoundError);
  });

  it('should throw if password is invalid', async () => {
    usersRepo.findByEmail.mockResolvedValue({
      id: '1',
      password: 'hashed-password',
      role: 'admin',
    });

    hashService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({
        email: 'admin@test.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
