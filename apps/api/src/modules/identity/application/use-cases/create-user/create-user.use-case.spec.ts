/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CreateUserUseCase } from './create-user.use-case';
import { EmailAlreadyInUseError } from '../../../domain/errors/auth.errors';
import { UserRole } from '../../../domain/enums/roles.enum';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;

  const usersRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const hashService = {
    hash: jest.fn(),
  };

  const patientRepo = {
    create: jest.fn(),
  };

  const doctorRepo = {
    create: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new CreateUserUseCase(
      hashService as any,
      usersRepo as any,
      patientRepo as any,
      doctorRepo as any,
    );
  });

  it('should register patient successfully', async () => {
    usersRepo.findByEmail.mockResolvedValue(null);

    hashService.hash.mockResolvedValue('hashed-password');

    usersRepo.create.mockResolvedValue({
      id: '1',
      email: 'patient@test.com',
      role: UserRole.PATIENT,
      documentType: 'cc',
      documentNumber: '123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    patientRepo.create.mockResolvedValue({
      userId: '1',
      birthDate: null,
    });

    const result = await useCase.execute({
      email: 'patient@test.com',
      password: 'patient123',
      role: UserRole.PATIENT,
      documentType: 'cc',
      documentNumber: '123',
    });

    expect(hashService.hash).toHaveBeenCalledWith('patient123');

    expect(usersRepo.create).toHaveBeenCalledWith({
      email: 'patient@test.com',
      password: 'hashed-password',
      role: UserRole.PATIENT,
      documentType: 'cc',
      documentNumber: '123',
    });

    expect(patientRepo.create).toHaveBeenCalledWith({
      userId: '1',
      birthDate: null,
    });

    expect(result.patient).toEqual({
      userId: '1',
      birthDate: null,
    });
  });

  it('should register doctor successfully', async () => {
    usersRepo.findByEmail.mockResolvedValue(null);

    hashService.hash.mockResolvedValue('hashed-password');

    usersRepo.create.mockResolvedValue({
      id: '2',
      email: 'doctor@test.com',
      role: UserRole.DOCTOR,
      documentType: 'cc',
      documentNumber: '456',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    doctorRepo.create.mockResolvedValue({
      userId: '2',
      specialty: null,
    });

    const result = await useCase.execute({
      email: 'doctor@test.com',
      password: 'doctor123',
      role: UserRole.DOCTOR,
      documentType: 'cc',
      documentNumber: '456',
    });

    expect(doctorRepo.create).toHaveBeenCalledWith({
      userId: '2',
      specialty: null,
    });

    expect(result.doctor).toEqual({
      userId: '2',
      specialty: null,
    });
  });

  it('should register admin successfully', async () => {
    usersRepo.findByEmail.mockResolvedValue(null);

    hashService.hash.mockResolvedValue('hashed-password');

    usersRepo.create.mockResolvedValue({
      id: '3',
      email: 'admin@test.com',
      role: UserRole.ADMIN,
      documentType: 'cc',
      documentNumber: '999',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute({
      email: 'admin@test.com',
      password: 'admin123',
      role: UserRole.ADMIN,
      documentType: 'cc',
      documentNumber: '999',
    });

    expect(patientRepo.create).not.toHaveBeenCalled();

    expect(doctorRepo.create).not.toHaveBeenCalled();

    expect(result.role).toBe(UserRole.ADMIN);
  });

  it('should throw if email already exists', async () => {
    usersRepo.findByEmail.mockResolvedValue({
      id: '1',
    });

    await expect(
      useCase.execute({
        email: 'existing@test.com',
        password: '123456',
        role: UserRole.PATIENT,
        documentType: 'cc',
        documentNumber: '123',
      }),
    ).rejects.toThrow(EmailAlreadyInUseError);
  });
});
