import { CredentialRegister, User } from '../types/auth.types';

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(data: CredentialRegister): Promise<User>;
  abstract addSession(userId: string, token: string): Promise<void>;
  abstract removeSession(userId: string): Promise<void>;
}
