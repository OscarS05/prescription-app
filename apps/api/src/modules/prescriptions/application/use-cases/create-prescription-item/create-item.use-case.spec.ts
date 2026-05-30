/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {
  CannotCreateItemInAConsumedPrescriptionError,
  PrescriptionDoesNotBelongToDoctorError,
  PrescriptionNotFound,
} from '../../../domain/errors/prescription.errors';
import { PrescriptionItem } from '../../../domain/types/prescription-items.type';
import { Prescription } from '../../../domain/types/prescription.types';
import { CreatePrescriptionItemUseCase } from './create-item.use-case';

describe('CreatePrescriptionItemUseCase', () => {
  let useCase: CreatePrescriptionItemUseCase;

  const prescriptionRepo = {
    findOneOrFail: jest.fn(),
  };

  const prescriptionItemRepo = {
    create: jest.fn(),
  };

  const doctorId = 'doctor-id';

  const prescription: Prescription = {
    id: 'prescription-id',
    code: '2026-001',
    doctorId,
    patientId: 'patient-id',
    notes: 'notes',
    status: PrescriptionStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    consumedAt: null,
  };

  const createData = {
    prescriptionId: prescription.id,
    name: 'Paracetamol',
    dosage: '500mg',
    instructions: 'After meals',
    quantity: 10,
  };

  const itemResponse: PrescriptionItem = {
    id: 'item-id',
    ...createData,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new CreatePrescriptionItemUseCase(
      prescriptionRepo as any,
      prescriptionItemRepo as any,
    );
  });

  describe('Successful cases', () => {
    it('should create a prescription item', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue(prescription);
      prescriptionItemRepo.create.mockResolvedValue([itemResponse]);

      const result = await useCase.execute(doctorId, createData);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.create).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.create).toHaveBeenCalledWith([createData]);
      expect(result).toEqual(itemResponse);
    });
  });

  describe('Error cases', () => {
    it('should throw when prescription does not belong to doctor', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...prescription,
        doctorId: 'another-doctor',
      });

      await expect(useCase.execute(doctorId, createData)).rejects.toThrow(
        PrescriptionDoesNotBelongToDoctorError,
      );

      expect(prescriptionItemRepo.create).not.toHaveBeenCalled();
    });

    it('should throw when prescription is consumed', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...prescription,
        status: PrescriptionStatus.CONSUMED,
      });

      await expect(useCase.execute(doctorId, createData)).rejects.toThrow(
        CannotCreateItemInAConsumedPrescriptionError,
      );

      expect(prescriptionItemRepo.create).not.toHaveBeenCalled();
    });

    it('should propagate PrescriptionNotFound', async () => {
      prescriptionRepo.findOneOrFail.mockRejectedValue(new PrescriptionNotFound());

      await expect(useCase.execute(doctorId, createData)).rejects.toThrow(
        PrescriptionNotFound,
      );

      expect(prescriptionItemRepo.create).not.toHaveBeenCalled();
    });
  });
});
