import { Injectable } from '@nestjs/common';

import { PdfGenerator } from '../../src/modules/prescriptions/domain/ports/pdf.port';

@Injectable()
export class FakePuppeteerPdfGenerator implements PdfGenerator {
  async generatePrescription(): Promise<Buffer> {
    return Buffer.from('fake-pdf');
  }
}
