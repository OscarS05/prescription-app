export type PrescriptionItem = {
  id: string;
  prescriptionId: string;
  name: string;
  dosage: string;
  quantity: number;
  instructions: string;
};

export type UpdatePrescriptionItem = Partial<Omit<PrescriptionItem, 'id' | 'prescriptionId'>>;
