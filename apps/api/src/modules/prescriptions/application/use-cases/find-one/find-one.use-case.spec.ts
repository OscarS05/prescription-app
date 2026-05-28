/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {} from '../../../domain/errors/prescription-item.errors';
import { PrescriptionNotFound } from '../../../domain/errors/prescription.errors';
import { PrescriptionItem } from '../../../domain/types/prescription-items.type';
import { Prescription } from '../../../domain/types/prescription.types';
import { FindOnePrescriptionUseCase } from './find-one.use-case';

describe('FindOnePrescriptionUseCase', () => {
  let useCase: FindOnePrescriptionUseCase;

  const prescriptionRepo = {
    findOneOrFail: jest.fn(),
  };

  const prescriptionId = 'prescription-id';

  const useCaseResponse: Prescription = {
    id: prescriptionId,
    code: '2026-124',
    doctorId: 'doctorId',
    patientId: '456',
    notes: 'notes updated',
    status: PrescriptionStatus.PENDING,
    updatedAt: new Date(),
    consumedAt: new Date(),
    createdAt: new Date(),
  };

  const item: PrescriptionItem = {
    id: 'duii',
    prescriptionId: useCaseResponse.id,
    name: 'Prescription name',
    dosage: 'dosage',
    instructions: 'lorem ipsum',
    quantity: 5,
  };

  const prescriptionWithItems = {
    ...useCaseResponse,
    items: [item, item],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new FindOnePrescriptionUseCase(prescriptionRepo as any);
  });

  describe('Successful cases', () => {
    it('should find the prescription', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue(prescriptionWithItems);

      const result = await useCase.execute(prescriptionId);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(result).toBe(prescriptionWithItems);
    });
  });

  describe('Fail cases', () => {
    it('should fail if the prescription was not found', async () => {
      prescriptionRepo.findOneOrFail.mockRejectedValue(new PrescriptionNotFound());

      await expect(useCase.execute(prescriptionId)).rejects.toThrow(PrescriptionNotFound);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
    });
  });
});
