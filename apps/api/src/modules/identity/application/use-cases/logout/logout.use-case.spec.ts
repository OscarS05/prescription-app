/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { LogoutUseCase } from './logout.use-case';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;

  const usersRepo = {
    removeSession: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new LogoutUseCase(usersRepo as any);
  });

  it('should logout successfully', async () => {
    usersRepo.removeSession.mockResolvedValue(undefined);

    await expect(
      useCase.execute({
        sub: '1',
        role: 'admin',
      } as any),
    ).resolves.not.toThrow();

    expect(usersRepo.removeSession).toHaveBeenCalledWith('1');
  });
});
