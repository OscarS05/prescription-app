import { Injectable } from '@nestjs/common';
import { PrescriptionRepository } from '../../../domain/ports/prescription.repository';
import {
  FindAllParams,
  Prescription,
  PrescriptionQueryFilters,
} from '../../../domain/types/prescription.types';
import { PayloadToken } from '../../../../identity/domain/types/auth.types';
import { UserRole } from '../../../../../shared/domain/enums/roles.enum';
import { SearchResponse } from '../../../../../shared/domain/types/query-params.types';

@Injectable()
export class FindAllPrescriptionsUseCase {
  constructor(private readonly prescriptionRepository: PrescriptionRepository) {}

  public async execute(
    payload: PayloadToken,
    data: FindAllParams,
  ): Promise<SearchResponse<Prescription>> {
    const offset = (data.page - 1) * data.limit;

    const query: PrescriptionQueryFilters = {
      ...data,
      offset: offset,
    };

    if (![UserRole.PATIENT, UserRole.ADMIN].includes(payload.role)) {
      delete query.doctorId;
    }

    if (![UserRole.DOCTOR, UserRole.ADMIN].includes(payload.role)) {
      delete query.patientId;
    }

    const [prescriptions, total] = await this.prescriptionRepository.findAll(
      payload.sub,
      query,
    );

    return {
      data: prescriptions,
      limit: data.limit,
      page: data.page,
      total,
      hasNextPage: total > data.page * data.limit,
    };
  }
}
