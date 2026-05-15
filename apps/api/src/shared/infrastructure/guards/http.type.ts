import { Request } from 'express';
import { PayloadToken } from '../../../modules/identity/domain/types/auth.types';

export interface AuthenticatedRequest extends Request {
  user: PayloadToken;
}
