import { Injectable, OnModuleInit } from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';

@Injectable()
export class TemplateService implements OnModuleInit {
  private prescriptionTemplate!: HandlebarsTemplateDelegate;

  async onModuleInit() {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'prescriptions',
      'infrastructure',
      'pdf',
      'templates',
      'prescription.hbs',
    );

    const source = await fs.promises.readFile(templatePath, 'utf8');

    this.prescriptionTemplate = Handlebars.compile(source);
  }

  renderPrescription(data) {
    return this.prescriptionTemplate(data);
  }
}
