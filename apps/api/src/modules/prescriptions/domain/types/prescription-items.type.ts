export type PrescriptionItem = {
  id: string;
  prescriptionId: string;
  name: string;
  dosage: string | null;
  quantity: string | null;
  instructions: string | null;
};

export type UpdatePrescriptionItem = Partial<Omit<PrescriptionItem, 'id' | 'prescriptionId'>>;
