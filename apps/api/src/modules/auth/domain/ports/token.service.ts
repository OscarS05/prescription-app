import { PayloadToken } from '../types/auth.types';

export abstract class TokenService {
  abstract generateAccessToken(payload: PayloadToken): Promise<string>;
  abstract generateRefreshToken(payload: PayloadToken): Promise<string>;
  abstract verifyAccessToken(token: string): Promise<PayloadToken>;
  abstract verifyRefreshToken(token: string): Promise<PayloadToken>;
}
