import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user.repository';
import { PrescriptionRepository } from '../../../../prescriptions/domain/ports/prescription.repository';
import { AdminMetricsRequest, AdminMetricsResponse } from '../../../domain/types/admin.types';

@Injectable()
export class GetAdminMetricsUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly prescriptionRepo: PrescriptionRepository,
  ) {}

  public async execute(period: AdminMetricsRequest): Promise<AdminMetricsResponse> {
    const [userMetrics, prescriptionMetrics] = await Promise.all([
      this.userRepo.getMetrics(period),
      this.prescriptionRepo.getMetrics(period),
    ]);

    const { prescriptionsInPeriod, totalPrescriptions, ...restPrescriptionMetrics } =
      prescriptionMetrics;

    return {
      period,
      totals: { ...userMetrics, prescriptionsInPeriod, totalPrescriptions },
      ...restPrescriptionMetrics,
    };
  }
}
