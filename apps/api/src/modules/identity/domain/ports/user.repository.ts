import { AdminMetricsRequest, TotalUserMetrics } from '../types/admin.types';
import { CredentialRegister, User, UserQueryFilters } from '../types/auth.types';

export abstract class UserRepository {
  abstract findAll(query: UserQueryFilters): Promise<[User[], number]>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(data: CredentialRegister): Promise<User>;
  abstract addSession(userId: string, token: string): Promise<void>;
  abstract removeSession(userId: string): Promise<void>;
  abstract getMetrics(filters: AdminMetricsRequest): Promise<TotalUserMetrics>;
}
