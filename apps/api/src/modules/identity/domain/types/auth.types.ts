import { Doctor } from './doctor.types';
import { Patient } from './patient.types';
import { UserRole } from '../../../../shared/domain/enums/roles.enum';
import {
  QueryFilters,
  QueryParams,
} from '../../../../shared/domain/types/query-params.types';

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

export type UserQueryParams = QueryParams & { roles: UserRole[] };
export type UserQueryFilters = QueryFilters & { roles: UserRole[] };

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
