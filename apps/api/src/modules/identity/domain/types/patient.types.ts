import { User } from './auth.types';

export type Patient = {
  userId: string;
  birthDate: Date | null;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
};

export type CreatePatient = Pick<Patient, 'userId' | 'birthDate'>;
