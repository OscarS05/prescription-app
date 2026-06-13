import { User } from './auth.types';
import { DoctorSignatures } from './signatures.types';

export type Doctor = {
  userId: string;
  specialty: string | null;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  signatures?: DoctorSignatures[];
};

export type CreateDoctor = Pick<Doctor, 'userId' | 'specialty'>;
