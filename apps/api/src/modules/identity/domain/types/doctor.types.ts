import { User } from './auth.types';
import { DoctorSignature } from './signatures.types';

export type Doctor = {
  userId: string;
  specialty: string | null;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  signatures?: DoctorSignature[];
};

export type CreateDoctor = Pick<Doctor, 'userId' | 'specialty'>;
