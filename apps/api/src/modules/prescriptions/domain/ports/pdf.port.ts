import { PrescriptionPdfData } from '../types/prescription.types';

export abstract class PdfGenerator {
  abstract generatePrescription(prescription: PrescriptionPdfData): Promise<Buffer>;
}
