import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { HashService } from '../../domain/ports/hash.service';

@Injectable()
export class HashServiceAdapter extends HashService {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
