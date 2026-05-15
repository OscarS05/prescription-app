import { Doctor } from './doctor.types';
import { Patient } from './patient.types';
import { UserRole } from '../enums/roles.enum';

export type User = {
  id: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  password: string;
  role: UserRole;
  refreshTokenHash: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  doctor?: Doctor;
  patient?: Patient;
};

export type DocumentType = 'cc' | 'ce' | 'pp' | 'ti';

export type UserInfo = Omit<User, 'password' | 'refreshTokenHash' | 'deletedAt'>;
export type UserResponse = {
  user: UserInfo;
  tokens: Tokens;
};

export type QueryParams = { role: UserRole[]; query: string; limit: number; page: number };
export type QueryRequest = {
  offset: number;
  limit: number;
  query: string | null;
  roles: UserRole[];
};
export type SearchResponse<T> = Pick<QueryRequest, 'limit'> &
  Pick<QueryParams, 'page'> & { data: T[]; total: number; hasNextPage: boolean };

export type Tokens = {
  refreshToken: string;
  accessToken: string;
};

export type Credentials = Pick<User, 'email' | 'password'>;

export type CredentialRegister = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'refreshTokenHash' | 'doctor' | 'patient'
>;

export type PayloadToken = {
  sub: string;
  role: UserRole;
};
