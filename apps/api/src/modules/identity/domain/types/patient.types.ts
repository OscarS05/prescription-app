export type Patient = {
  userId: string;
  birthDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePatient = Pick<Patient, 'userId' | 'birthDate'>;
