/* eslint-disable @typescript-eslint/no-unsafe-argument */
// refresh-session.use-case.spec.ts

import { RefreshSessionUseCase } from './refresh-session.use-case';
import { DomainNotFoundError, InvalidSessionError } from '../../../domain/errors/auth.errors';

describe('RefreshSessionUseCase', () => {
  let useCase: RefreshSessionUseCase;

  const sessionManagerService = {
    GenerateSession: jest.fn(),
  };

  const hashService = {
    compare: jest.fn(),
  };

  const usersRepo = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new RefreshSessionUseCase(
      sessionManagerService as any,
      hashService as any,
      usersRepo as any,
    );
  });

  it('should refresh session successfully', async () => {
    usersRepo.findById.mockResolvedValue({
      id: '1',
      refreshTokenHash: 'hashed-token',
    });

    hashService.compare.mockResolvedValue(true);

    sessionManagerService.GenerateSession.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    const result = await useCase.execute(
      {
        sub: '1',
        role: 'admin',
      } as any,
      'refresh-token',
    );

    expect(result.accessToken).toBe('access');
  });

  it('should throw if user does not exist', async () => {
    usersRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ sub: '1', role: 'admin' } as any, 'token'),
    ).rejects.toThrow(DomainNotFoundError);
  });

  it('should throw if session does not exist', async () => {
    usersRepo.findById.mockResolvedValue({
      id: '1',
      refreshTokenHash: null,
    });

    await expect(
      useCase.execute({ sub: '1', role: 'admin' } as any, 'token'),
    ).rejects.toThrow(InvalidSessionError);
  });

  it('should throw if token is invalid', async () => {
    usersRepo.findById.mockResolvedValue({
      id: '1',
      refreshTokenHash: 'hashed-token',
    });

    hashService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ sub: '1', role: 'admin' } as any, 'token'),
    ).rejects.toThrow(InvalidSessionError);
  });
});
