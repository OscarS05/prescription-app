import { PaylodToken } from '../types/auth.types';

export abstract class TokenService {
  abstract generateAccessToken(payload: PaylodToken): Promise<string>;
  abstract generateRefreshToken(payload: PaylodToken): Promise<string>;
  abstract verifyAccessToken(token: string): Promise<PaylodToken>;
  abstract verifyRefreshToken(token: string): Promise<PaylodToken>;
}
