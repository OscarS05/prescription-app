import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user.repository';
import { PrescriptionRepository } from '../../../../prescriptions/domain/ports/prescription.repository';
import { AdminMetricsResponse } from '../../../domain/types/admin.types';

@Injectable()
export class GetAdminMetricsUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly prescriptionRepo: PrescriptionRepository,
  ) {}

  public async execute(period: { from?: Date; to?: Date }): Promise<AdminMetricsResponse> {
    const to = period.to ?? new Date();
    const from = period.from ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const periodNormalized = { from, to };

    const [userMetrics, prescriptionMetrics] = await Promise.all([
      this.userRepo.getMetrics(periodNormalized),
      this.prescriptionRepo.getMetrics(periodNormalized),
    ]);

    const { prescriptionsInPeriod, totalPrescriptions, ...restPrescriptionMetrics } =
      prescriptionMetrics;

    return {
      period: { from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0] },
      totals: { ...userMetrics, prescriptionsInPeriod, totalPrescriptions },
      ...restPrescriptionMetrics,
    };
  }
}
