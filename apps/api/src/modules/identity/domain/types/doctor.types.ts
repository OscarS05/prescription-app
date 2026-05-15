export type Doctor = {
  userId: string;
  specialty: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDoctor = Pick<Doctor, 'userId' | 'specialty'>;
