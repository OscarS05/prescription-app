/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {
  PrescriptionItemConflictError,
  PrescriptionItemIdDoesNotMatchError,
} from '../../../domain/errors/prescription-item.errors';
import {
  DoctorIdDoesNotBelongError,
  PrescriptionNotFound,
} from '../../../domain/errors/prescription.errors';
import { PrescriptionItem } from '../../../domain/types/prescription-items.type';
import { Prescription } from '../../../domain/types/prescription.types';
import { EditPrescriptionUseCase } from './edit-prescription.use-case';

describe('EditPrescriptionUseCase', () => {
  let useCase: EditPrescriptionUseCase;

  const prescriptionRepo = {
    update: jest.fn(),
    findOneOrFail: jest.fn(),
  };

  const prescriptionItemRepo = {
    update: jest.fn(),
  };

  const id = 'prescription-id';
  const doctorId = 'doctor-id';
  const notesToUpdate = 'new notes';
  const itemsToUpdate = {
    id: 'item-id',
    name: 'new name',
    dosage: 'new dosage',
    instructions: 'new instructions',
    quantity: 6,
  };

  const useCaseResponse: Prescription = {
    id: 'uuid',
    code: '2026-124',
    doctorId: doctorId,
    patientId: '456',
    notes: 'notes updated',
    status: PrescriptionStatus.PENDING,
    updatedAt: new Date(),
    consumedAt: new Date(),
    createdAt: new Date(),
  };

  const itemResponse: PrescriptionItem = {
    id: itemsToUpdate.id,
    prescriptionId: useCaseResponse.id,
    name: 'Prescription name',
    dosage: 'dosage',
    instructions: 'lorem ipsum',
    quantity: 5,
  };

  const transaction = {
    execute: jest.fn(),
  };

  beforeAll(() => {
    transaction.execute.mockImplementation((callback) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return callback();
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new EditPrescriptionUseCase(
      prescriptionRepo as any,
      prescriptionItemRepo as any,
      transaction,
    );
  });

  describe('Successfull cases', () => {
    it('should update only the prescription', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue(useCaseResponse);
      prescriptionRepo.update.mockResolvedValue(useCaseResponse);

      const result = await useCase.execute(id, doctorId, { notes: notesToUpdate, items: [] });

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(2);
      expect(prescriptionRepo.update).toHaveBeenCalledTimes(1);
      expect(transaction.execute).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.update).not.toHaveBeenCalled();
      expect(result.id).toBe(useCaseResponse.id);
      expect(result.items).not.toBeDefined();
      expect(result.notes).toBe(useCaseResponse.notes);
    });

    it('should update the prescription with items', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...useCaseResponse,
        items: [itemResponse, itemResponse],
      });
      prescriptionRepo.update.mockResolvedValue(useCaseResponse);
      prescriptionItemRepo.update.mockResolvedValue([itemResponse, itemResponse]);

      const result = await useCase.execute(id, doctorId, {
        notes: notesToUpdate,
        items: [itemsToUpdate, itemsToUpdate],
      });

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(2);
      expect(prescriptionRepo.update).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.update).toHaveBeenCalledTimes(1);
      expect(transaction.execute).toHaveBeenCalledTimes(1);
      expect(result.id).toBe(useCaseResponse.id);
      expect(result.items?.length).toBe(2);
      expect(result.notes).toBe(useCaseResponse.notes);
    });
  });

  describe('Fail cases', () => {
    it('should fail if the prescription was not found', async () => {
      prescriptionRepo.findOneOrFail.mockRejectedValue(new PrescriptionNotFound());

      await expect(
        useCase.execute(id, doctorId, {
          notes: notesToUpdate,
          items: [itemsToUpdate, itemsToUpdate],
        }),
      ).rejects.toThrow(PrescriptionNotFound);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.update).not.toHaveBeenCalled();
      expect(prescriptionItemRepo.update).not.toHaveBeenCalled();
    });

    it('should fail if the prescription does not have items but use case received items to update', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue(useCaseResponse);

      await expect(
        useCase.execute(id, doctorId, {
          notes: notesToUpdate,
          items: [itemsToUpdate, itemsToUpdate],
        }),
      ).rejects.toThrow(PrescriptionItemConflictError);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.update).not.toHaveBeenCalled();
      expect(prescriptionItemRepo.update).not.toHaveBeenCalled();
    });

    it('should fail if the doctorId does not match with prescription stored', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...useCaseResponse,
        doctorId: 'wrong-id',
      });

      await expect(
        useCase.execute(id, doctorId, {
          notes: notesToUpdate,
          items: [itemsToUpdate, itemsToUpdate],
        }),
      ).rejects.toThrow(DoctorIdDoesNotBelongError);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.update).not.toHaveBeenCalled();
      expect(prescriptionItemRepo.update).not.toHaveBeenCalled();
    });

    it('should fail if some itemId does not match with the items stored', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...useCaseResponse,
        items: [itemResponse, itemResponse],
      });

      await expect(
        useCase.execute(id, doctorId, {
          notes: notesToUpdate,
          items: [itemsToUpdate, { ...itemsToUpdate, id: 'wrong-id' }],
        }),
      ).rejects.toThrow(PrescriptionItemIdDoesNotMatchError);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.update).not.toHaveBeenCalled();
      expect(prescriptionItemRepo.update).not.toHaveBeenCalled();
    });
  });
});
