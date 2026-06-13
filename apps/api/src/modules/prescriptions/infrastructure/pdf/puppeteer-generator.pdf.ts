import { Injectable } from '@nestjs/common';

import { PdfGenerator } from '../../domain/ports/pdf.port';
import { PrescriptionPdfData } from '../../domain/types/prescription.types';
import { PuppeteerService } from '../services/puppeteer.service';
import { TemplateService } from '../services/templates.service';

@Injectable()
export class PuppeteerPdfGenerator implements PdfGenerator {
  constructor(
    private puppeteerService: PuppeteerService,
    private templateService: TemplateService,
  ) {}

  async generatePrescription(data: PrescriptionPdfData): Promise<Buffer> {
    const html = this.templateService.renderPrescription(data);

    const page = await this.puppeteerService.browser.newPage();
    await page.setContent(html);

    const pdf = await page.pdf({
      format: 'A4',
      displayHeaderFooter: true,

      margin: {
        top: '20px',
        right: '20px',
        bottom: '80px',
        left: '20px',
      },
      footerTemplate: `
        <div
          style="
            width:100%;
            text-align:center;
            font-family:Arial,sans-serif;
            color:#666;
            padding-bottom:10px;
          "
        >
          <p
            style="
              margin:0;
              font-size:12px;
              font-weight:bold;
            "
          >
            PRESCRIPTION APP | ${new Date().getFullYear()}
          </p>

          <p
            style="
              margin:0;
              font-size:10px;
            "
          >
            Generated: ${new Date().toLocaleDateString()}
          </p>

          <p
            style="
              margin:0;
              font-size:10px;
            "
          >
            Page
            <span class="pageNumber"></span>
            of
            <span class="totalPages"></span>
          </p>
        </div>
      `,
    });

    return Buffer.from(pdf);
  }
}
