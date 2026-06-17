export type DoctorSignature = {
  id: string;
  doctorId: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSignature = Pick<DoctorSignature, 'doctorId' | 'imageUrl' | 'isActive'>;
