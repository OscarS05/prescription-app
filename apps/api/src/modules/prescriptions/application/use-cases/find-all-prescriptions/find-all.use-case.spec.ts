/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { UserRole } from '../../../../../shared/domain/enums/roles.enum';
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import { PrescriptionItem } from '../../../domain/types/prescription-items.type';
import { FindAllParams, Prescription } from '../../../domain/types/prescription.types';
import { FindAllPrescriptionsUseCase } from './find-all.use-case';

describe('FindAllPrescriptionsUseCase', () => {
  let useCase: FindAllPrescriptionsUseCase;

  const prescriptionRepo = {
    findAll: jest.fn(),
  };

  const doctorId = 'doctorId';
  const patientId = 'patientId';
  const prescriptionId = 'prescription-id';

  const payloadDoctorToken = { role: UserRole.DOCTOR, sub: doctorId };
  const payloadPatientToken = { role: UserRole.PATIENT, sub: patientId };

  const useCaseResponse: Prescription = {
    id: prescriptionId,
    code: '2026-124',
    doctorId: doctorId,
    patientId: patientId,
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

  const filters: FindAllParams = {
    limit: 15,
    page: 1,
    order: 'DESC',
  };

  const useCaseFiltersResponse = {
    hasNextPage: false,
    limit: 15,
    page: 1,
    total: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new FindAllPrescriptionsUseCase(prescriptionRepo as any);
  });

  describe('Successful cases', () => {
    it('should find the doctor prescriptions', async () => {
      prescriptionRepo.findAll.mockResolvedValue([
        [prescriptionWithItems, prescriptionWithItems],
        2,
      ]);

      const result = await useCase.execute(payloadDoctorToken, {
        ...filters,
        doctorId,
        patientId,
      });

      expect(prescriptionRepo.findAll).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.findAll).toHaveBeenCalledWith(doctorId, {
        ...filters,
        offset: 0,
        patientId,
      });
      expect(result).toMatchObject({
        ...useCaseFiltersResponse,
        total: 2,
        data: [prescriptionWithItems, prescriptionWithItems],
      });
    });

    it('should find the patient prescriptions', async () => {
      prescriptionRepo.findAll.mockResolvedValue([[prescriptionWithItems], 1]);

      const result = await useCase.execute(payloadPatientToken, {
        ...filters,
        doctorId,
        patientId,
      });

      expect(prescriptionRepo.findAll).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.findAll).toHaveBeenCalledWith(patientId, {
        ...filters,
        doctorId,
        offset: 0,
      });
      expect(result).toMatchObject({
        ...useCaseFiltersResponse,
        data: [prescriptionWithItems],
      });
    });

    it('should find the patient prescriptions with filters', async () => {
      prescriptionRepo.findAll.mockResolvedValue([[prescriptionWithItems], 1]);

      const result = await useCase.execute(payloadPatientToken, {
        ...filters,
        createdAtFrom: new Date(),
        createdAtTo: new Date(),
      });

      expect(prescriptionRepo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        ...useCaseFiltersResponse,
        data: [prescriptionWithItems],
      });
    });
  });
});
