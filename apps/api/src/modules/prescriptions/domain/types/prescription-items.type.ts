export type PrescriptionItem = {
  id: string;
  prescriptionId: string;
  name: string;
  dosage: string | null;
  quantity: number | null;
  instructions: string | null;
};

export type CreatePrescriptionItem = Omit<PrescriptionItem, 'id'>;
export type UpdatePrescriptionItem = Partial<Omit<PrescriptionItem, 'prescriptionId'>>;
