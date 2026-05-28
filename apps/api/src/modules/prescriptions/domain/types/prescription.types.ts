import { QueryParams } from '../../../../shared/domain/types/query-params.types';
import { PrescriptionStatus } from '../enums/prescription-status.enum';
import { PrescriptionItem } from './prescription-items.type';

export type Prescription = {
  id: string;
  doctorId: string;
  patientId: string;
  code: string;
  status: PrescriptionStatus;
  notes: string | null;
  createdAt: Date;
  consumedAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  items?: PrescriptionItem[];
};

export type CreatePrescription = Omit<
  Prescription,
  'id' | 'createdAt' | 'updatedAt' | 'consumedAt' | 'deletedAt' | 'items'
>;

export type UpdatePrescription = Partial<Pick<Prescription, 'notes'>>;

export type FindAllParams = Omit<QueryParams, 'query'> & {
  createdAtFrom?: Date | null;
  createdAtTo?: Date | null;
  code?: string | null;
  status?: PrescriptionStatus | null;
  doctorId?: string | null;
  patientId?: string | null;
};

// For repository
export type PrescriptionQuery = Omit<FindAllParams, 'page'> & {
  offset: number;
};
