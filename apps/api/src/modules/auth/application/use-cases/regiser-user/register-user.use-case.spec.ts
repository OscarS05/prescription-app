/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { RegisterUserUseCase } from './register-user.use-case';
import { EmailAlreadyInUseError } from '../../../domain/errors/auth.errors';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;

  const usersRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const hashService = {
    hash: jest.fn(),
  };

  const sessionManagerService = {
    GenerateSession: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new RegisterUserUseCase(
      sessionManagerService as any,
      hashService as any,
      usersRepo as any,
    );
  });

  it('should register successfully', async () => {
    usersRepo.findByEmail.mockResolvedValue(null);

    hashService.hash.mockResolvedValue('hashed-password');

    usersRepo.create.mockResolvedValue({
      id: '1',
      role: 'patient',
    });

    sessionManagerService.GenerateSession.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    const result = await useCase.execute({
      email: 'patient@test.com',
      password: 'patient123',
      role: 'patient',
      documentType: 'cc',
      documentNumber: '123',
      name: 'Patient',
    } as any);

    expect(result.accessToken).toBe('access');
  });

  it('should throw if email already exists', async () => {
    usersRepo.findByEmail.mockResolvedValue({ id: '1' });

    await expect(useCase.execute({} as any)).rejects.toThrow(EmailAlreadyInUseError);
  });
});
