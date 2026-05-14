/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { SessionManagerService } from './session-manager.service';

describe('SessionManagerService', () => {
  let service: SessionManagerService;

  const tokensService = {
    generateRefreshToken: jest.fn(),
    generateAccessToken: jest.fn(),
  };

  const hashService = {
    hash: jest.fn(),
  };

  const usersRepo = {
    addSession: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new SessionManagerService(
      tokensService as any,
      hashService as any,
      usersRepo as any,
    );
  });

  it('should generate session successfully', async () => {
    tokensService.generateRefreshToken.mockResolvedValue('refresh-token');

    tokensService.generateAccessToken.mockResolvedValue('access-token');

    hashService.hash.mockResolvedValue('hashed-token');

    const result = await service.GenerateSession({
      sub: '1',
      role: 'admin',
    } as any);

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    expect(usersRepo.addSession).toHaveBeenCalled();
  });
});
