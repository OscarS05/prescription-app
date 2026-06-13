import { Injectable } from '@nestjs/common';
import { PdfGenerator } from '../../../domain/ports/pdf.port';
import { PrescriptionRepository } from '../../../domain/ports/prescription.repository';
import { PrescriptionPdfData } from '../../../domain/types/prescription.types';
import { UserRepository } from '../../../../identity/domain/ports/user.repository';
import { DomainNotFoundError } from '../../../../identity/domain/errors/auth.errors';
import { ConfigService } from '../../../../../shared/domain/ports/config.service';
import { QrService } from '../../../../../shared/domain/ports/qr.service';
import { DoctorSignatureRepository } from '../../../../identity/domain/ports/signature.repository';

@Injectable()
export class GeneratePrescriptionPdfUseCase {
  constructor(
    private readonly prescriptionRepo: PrescriptionRepository,
    private readonly userRepo: UserRepository,
    private readonly doctorSignatureRepo: DoctorSignatureRepository,
    private readonly pdfGenerator: PdfGenerator,
    private readonly configService: ConfigService,
    private readonly qrService: QrService,
  ) {}

  async execute(prescriptionId: string): Promise<Buffer> {
    const prescription = await this.prescriptionRepo.findOneOrFail(prescriptionId, true);
    const [userDoctor, userPatient, doctorSignature] = await Promise.all([
      this.userRepo.findById(prescription.doctorId),
      this.userRepo.findById(prescription.patientId),
      this.doctorSignatureRepo.findByDoctorId(prescription.doctorId, true),
    ]);

    if (!userDoctor || !userPatient) throw new DomainNotFoundError();

    const pdfData: PrescriptionPdfData = {
      code: prescription.code,
      doctorEmail: userDoctor.email,
      patientEmail: userPatient.email,
      patientDNI: `${userPatient.documentType.toUpperCase()} ${userPatient.documentNumber}`,
      notes: prescription.notes,
      qrCode: await this.qrService.generate(
        `${this.configService.get<string>('FRONTEND_URL')}/prescriptions/${prescription.id}`,
      ),
      doctorSignatureUrl: doctorSignature.imageUrl,
      createdAt: prescription.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      items:
        prescription.items?.map((item) => ({
          name: item.name,
          dosage: item.dosage,
          quantity: item.quantity,
          instructions: item.instructions,
        })) || [],
    };

    return this.pdfGenerator.generatePrescription(pdfData);
  }
}
