import { UserRole } from '../enums/roles.enum';

export type User = {
  id: string;
  documentType: string;
  documentNumber: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  refreshTokenHash: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type SessionResponse = {
  refreshToken: string;
  accessToken: string;
};

export type Credentials = Pick<User, 'email' | 'password'>;

export type CredentialRegister = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'refreshTokenHash'
>;

export type PaylodToken = {
  sub: string;
  role: UserRole;
};
