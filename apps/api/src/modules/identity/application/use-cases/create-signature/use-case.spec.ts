/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { DomainInternalServerError } from '../../../../../shared/domain/errors/shared.errors';
import { CreateSignatureUseCase } from './use-case';

describe('CreateSignatureUseCase', () => {
  let useCase: CreateSignatureUseCase;

  const signatureRepo = {
    create: jest.fn(),
    deactivateAll: jest.fn(),
    delete: jest.fn(),
  };

  const imageService = {
    save: jest.fn(),
    delete: jest.fn(),
  };

  const transaction = {
    execute: jest.fn(),
  };

  const parameters = {
    userId: 'user-id',
    buffer: Buffer.from('signature'),
  };

  const folder = '/uploads/signatures/img-1.jpg';

  beforeAll(() => {
    transaction.execute.mockImplementation((callback) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return callback();
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new CreateSignatureUseCase(signatureRepo as any, imageService, transaction);
  });

  describe('Succesful cases', () => {
    it('should create the signature', async () => {
      imageService.save.mockResolvedValue('/uploads/signatures/img-1.jpg');
      signatureRepo.deactivateAll.mockResolvedValue(undefined);
      signatureRepo.create.mockResolvedValue(undefined);

      const result = await useCase.execute(parameters);

      expect(signatureRepo.create).toHaveBeenCalledTimes(1);
      expect(signatureRepo.create).toHaveBeenCalledWith({
        doctorId: parameters.userId,
        imageUrl: '/uploads/signatures/img-1.jpg',
        isActive: true,
      });
      expect(signatureRepo.create).not.toHaveReturnedWith();
      expect(signatureRepo.deactivateAll).not.toHaveReturnedWith();
      expect(signatureRepo.deactivateAll).toHaveReturnedTimes(1);
      expect(transaction.execute).toHaveReturnedTimes(1);

      expect(imageService.save).toHaveBeenCalledTimes(1);
      await expect(imageService.save).resolves.toEqual(folder);

      expect(imageService.delete).toHaveBeenCalledTimes(0);

      expect(result).toBeUndefined();
    });
  });

  describe('Failed cases', () => {
    it('should not save a signature', async () => {
      imageService.save.mockRejectedValue(new DomainInternalServerError());

      await expect(useCase.execute(parameters)).rejects.toThrow(DomainInternalServerError);

      expect(signatureRepo.create).toHaveBeenCalledTimes(0);

      expect(imageService.save).toHaveBeenCalledTimes(1);
      expect(imageService.delete).toHaveBeenCalledTimes(0);
      expect(transaction.execute).toHaveReturnedTimes(0);
    });

    it('should not create a signature in database', async () => {
      imageService.save.mockResolvedValue('/uploads/signatures/img-1.jpg');
      signatureRepo.deactivateAll.mockResolvedValue(undefined);
      signatureRepo.create.mockRejectedValue(new DomainInternalServerError());

      await expect(useCase.execute(parameters)).rejects.toThrow(DomainInternalServerError);

      expect(imageService.save).toHaveBeenCalledTimes(1);
      expect(transaction.execute).toHaveReturnedTimes(1);
      expect(signatureRepo.deactivateAll).toHaveBeenCalledTimes(1);
      expect(signatureRepo.create).toHaveBeenCalledTimes(1);

      expect(imageService.delete).toHaveBeenCalledTimes(1);
    });

    it('should not deactivate all users signatures', async () => {
      imageService.save.mockResolvedValue('/uploads/signatures/img-1.jpg');
      signatureRepo.deactivateAll.mockRejectedValue(new DomainInternalServerError());

      await expect(useCase.execute(parameters)).rejects.toThrow(DomainInternalServerError);

      expect(imageService.save).toHaveBeenCalledTimes(1);
      expect(transaction.execute).toHaveReturnedTimes(1);
      expect(signatureRepo.deactivateAll).toHaveBeenCalledTimes(1);
      expect(signatureRepo.create).toHaveBeenCalledTimes(0);

      expect(imageService.delete).toHaveBeenCalledTimes(1);
    });
  });
});
