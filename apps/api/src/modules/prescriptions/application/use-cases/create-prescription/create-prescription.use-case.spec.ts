/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {
  DomainInternalError,
  PrescriptionCodeError,
} from '../../../domain/errors/prescription.errors';
import { PrescriptionItem } from '../../../domain/types/prescription-items.type';
import { Prescription } from '../../../domain/types/prescription.types';
import { CreatePrescriptionUseCase, Props } from './create-prescription.use-case';

describe('CreatePrescriptionUseCase', () => {
  let useCase: CreatePrescriptionUseCase;

  const prescriptionRepo = {
    create: jest.fn(),
    findTheLastCode: jest.fn(),
  };

  const prescriptionItemRepo = {
    create: jest.fn(),
  };

  const data: Props = {
    doctorId: 'uuid-123',
    patientId: 'uuid-456',
    notes: null,
  };

  const useCaseResponse: Prescription = {
    ...data,
    id: 'uuid',
    code: '2026-124',
    status: PrescriptionStatus.PENDING,
    consumedAt: new Date(),
    createdAt: new Date(),
  };

  const item: PrescriptionItem = {
    id: 'diuu',
    prescriptionId: useCaseResponse.id,
    name: 'Prescription name',
    dosage: 'dosage',
    instructions: 'lorem ipsum',
    quantity: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new CreatePrescriptionUseCase(
      prescriptionRepo as any,
      prescriptionItemRepo as any,
    );
  });

  describe('Successfull cases', () => {
    it('should create only the prescription', async () => {
      prescriptionRepo.create.mockResolvedValue(useCaseResponse);
      prescriptionRepo.findTheLastCode.mockResolvedValue('2026-123');

      const result = await useCase.execute({ ...data, items: [] });

      expect(prescriptionRepo.create).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.findTheLastCode).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.create).not.toHaveBeenCalled();
      expect(result.id).toBe(useCaseResponse.id);
      expect(result.items).not.toBeDefined();
      expect(result.code).toBe('2026-124');
    });

    it('should create the prescription with items', async () => {
      prescriptionRepo.create.mockResolvedValue(useCaseResponse);
      prescriptionRepo.findTheLastCode.mockResolvedValue('2026-123');
      prescriptionItemRepo.create.mockResolvedValue([item, item]);

      const result = await useCase.execute({ ...data, items: [item, item] });

      expect(prescriptionRepo.create).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.findTheLastCode).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.create).toHaveBeenCalledTimes(1);
      expect(result.id).toBe(useCaseResponse.id);
      expect(result.items?.length).toBe(2);
      expect(result.code).toBe('2026-124');
    });

    it('should create the prescription after the 3rd attempt', async () => {
      prescriptionRepo.create
        .mockRejectedValueOnce(new PrescriptionCodeError())
        .mockRejectedValueOnce(new PrescriptionCodeError())
        .mockRejectedValueOnce(new PrescriptionCodeError())
        .mockResolvedValue(useCaseResponse);
      prescriptionRepo.findTheLastCode.mockResolvedValue('2026-123');
      prescriptionItemRepo.create.mockResolvedValue([item, item]);

      const result = await useCase.execute({ ...data, items: [item, item] });

      expect(prescriptionRepo.create).toHaveBeenCalledTimes(4);
      expect(prescriptionRepo.findTheLastCode).toHaveBeenCalledTimes(4);
      expect(prescriptionItemRepo.create).toHaveBeenCalledTimes(1);
      expect(result.id).toBe(useCaseResponse.id);
      expect(result.items?.length).toBe(2);
      expect(result.code).toBe('2026-124');
    });
  });

  describe('Fail cases', () => {
    it('should fail if prescription code is already in use', async () => {
      prescriptionRepo.create
        .mockRejectedValueOnce(new PrescriptionCodeError())
        .mockRejectedValueOnce(new PrescriptionCodeError())
        .mockRejectedValueOnce(new PrescriptionCodeError())
        .mockRejectedValueOnce(new PrescriptionCodeError())
        .mockRejectedValueOnce(new PrescriptionCodeError());

      await expect(useCase.execute(data)).rejects.toThrow(PrescriptionCodeError);

      expect(prescriptionRepo.create).toHaveBeenCalledTimes(5);
      expect(prescriptionRepo.findTheLastCode).toHaveBeenCalledTimes(5);
      expect(prescriptionItemRepo.create).not.toHaveBeenCalled();
    });

    it('should fail if prescriptionRepo.create fail', async () => {
      prescriptionRepo.create.mockRejectedValue(new DomainInternalError());

      await expect(useCase.execute(data)).rejects.toThrow(DomainInternalError);

      expect(prescriptionRepo.create).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.findTheLastCode).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.create).not.toHaveBeenCalled();
    });

    it('should fail if prescriptionItemRepo.create fail', async () => {
      prescriptionRepo.findTheLastCode.mockResolvedValue('2026-123');
      prescriptionRepo.create.mockResolvedValue(useCaseResponse);
      prescriptionItemRepo.create.mockRejectedValue(new DomainInternalError());

      await expect(useCase.execute({ ...data, items: [item] })).rejects.toThrow(
        DomainInternalError,
      );

      expect(prescriptionRepo.create).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.findTheLastCode).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.create).toHaveBeenCalledTimes(1);
    });
  });
});
