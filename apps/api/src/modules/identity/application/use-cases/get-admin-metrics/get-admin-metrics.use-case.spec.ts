import { Test, TestingModule } from '@nestjs/testing';

import { GetAdminMetricsUseCase } from './get-admin-metrics.use-case';

import { UserRepository } from '../../../domain/ports/user.repository';
import { AdminMetricsResponse } from '../../../domain/types/admin.types';
import { PrescriptionRepository } from '../../../../prescriptions/domain/ports/prescription.repository';

describe('GetUserInfoUseCase', () => {
  let useCase: GetAdminMetricsUseCase;

  const userRepositoryMock = {
    getMetrics: jest.fn(),
  };

  const prescriptionRepositoryMock = {
    getMetrics: jest.fn(),
  };

  const lastThirtyDays = new Date();
  lastThirtyDays.setTime(lastThirtyDays.getTime() - 30 * 24 * 60 * 60 * 1000);

  const validResult: AdminMetricsResponse = {
    period: {
      from: lastThirtyDays.toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
    },

    totals: {
      doctors: 10,
      patients: 100,
      newPatients: 20,
      totalPrescriptions: 200,
      prescriptionsInPeriod: 50,
    },

    byStatus: {
      consumed: 30,
      pending: 20,
    },

    prescriptionsPerDay: [
      {
        date: new Date().toISOString().split('T')[0],
        count: 5,
      },
    ],

    topDoctors: [
      {
        doctorId: 'doctor-1',
        doctorEmail: 'Dr. Smith',
        prescriptions: 15,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAdminMetricsUseCase,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: PrescriptionRepository,
          useValue: prescriptionRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get(GetAdminMetricsUseCase);

    jest.clearAllMocks();
  });

  describe('Sucessful cases', () => {
    it('should return metrics', async () => {
      userRepositoryMock.getMetrics.mockResolvedValue(validResult.totals);
      prescriptionRepositoryMock.getMetrics.mockResolvedValue({
        totalPrescriptions: validResult.totals.totalPrescriptions,
        prescriptionsInPeriod: validResult.totals.prescriptionsInPeriod,
        byStatus: validResult.byStatus,
        prescriptionsPerDay: validResult.prescriptionsPerDay,
        topDoctors: validResult.topDoctors,
      });

      const result = await useCase.execute({
        from: new Date(validResult.period.from),
        to: new Date(validResult.period.to),
      });

      expect(result).toMatchObject(validResult);
    });
  });
});
