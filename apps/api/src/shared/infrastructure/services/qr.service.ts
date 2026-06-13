import { Injectable } from '@nestjs/common';
import QRCode from 'qrcode';

import { QrService } from '../../domain/ports/qr.service';

@Injectable()
export class QrCodeGenerator implements QrService {
  async generate(value: string) {
    return QRCode.toDataURL(value);
  }
}
