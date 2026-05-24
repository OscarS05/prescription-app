import { PrescriptionStatus } from '../enums/prescription-status.enum';
import { PrescriptionItem } from './prescription-items.type';

export type Prescription = {
  id: string;
  doctorId: string;
  patientId: string;
  code: string;
  status: PrescriptionStatus;
  notes: string;
  createdAt: Date;
  consumedAt: Date;
  deletedAt?: Date | null;

  items: PrescriptionItem;
};

export type UpdatePrescription = Partial<
  Pick<Prescription, 'code' | 'status' | 'notes' | 'consumedAt'>
>;
