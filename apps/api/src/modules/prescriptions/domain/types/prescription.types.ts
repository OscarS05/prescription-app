import {
  QueryFilters,
  QueryParams,
} from '../../../../shared/domain/types/query-params.types';
import { Doctor } from '../../../identity/domain/types/doctor.types';
import { Patient } from '../../../identity/domain/types/patient.types';
import { PrescriptionStatus } from '../enums/prescription-status.enum';
import { PrescriptionItem } from './prescription-items.type';

export type Prescription = {
  id: string;
  doctorId: string;
  doctorSignatureId?: string | null;
  patientId: string;
  code: string;
  status: PrescriptionStatus;
  notes: string | null;
  createdAt: Date;
  consumedAt: Date | null;
  updatedAt: Date;
  deletedAt?: Date | null;

  items?: PrescriptionItem[];
  doctor?: Doctor;
  patient?: Patient;
};

export type CreatePrescription = Pick<
  Prescription,
  'doctorId' | 'patientId' | 'code' | 'status' | 'notes'
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

export type PrescriptionQueryFilters = Omit<FindAllParams, 'page'> &
  Omit<QueryFilters, 'query'>;

export type PrescriptionPdfData = Pick<Prescription, 'code' | 'notes'> & {
  doctorEmail: string;
  patientEmail: string;
  patientDNI: string;
  createdAt: string;
  qrCode: string;
  doctorSignatureUrl: string;
  items: Omit<PrescriptionItem, 'id' | 'prescriptionId'>[];
};
