/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { DomainNotFoundError } from '../../../../identity/domain/errors/auth.errors';
import { GeneratePrescriptionPdfUseCase } from './generate-prescription-pdf.use-case';

describe('GeneratePrescriptionPdfUseCase', () => {
  let useCase: GeneratePrescriptionPdfUseCase;

  const prescriptionRepo = {
    findOneOrFail: jest.fn(),
  };

  const userRepo = {
    findById: jest.fn(),
  };

  const pdfGenerator = {
    generatePrescription: jest.fn(),
  };

  const DoctorSignatureRepository = {
    findByDoctorId: jest.fn(),
  };

  const ConfigService = {
    get: jest.fn(),
  };

  const QrService = {
    generate: jest.fn(),
  };

  const prescriptionId = 'prescription-id';

  const prescription = {
    id: prescriptionId,
    code: '2026-0001',
    doctorId: 'doctor-id',
    patientId: 'patient-id',
    notes: 'Take after meals',
    createdAt: new Date('2026-06-04'),
    items: [
      {
        name: 'Ibuprofen',
        dosage: '500mg',
        quantity: 10,
        instructions: 'After meals',
      },
    ],
  };

  const doctorSignature = {
    id: 'sign-id',
    doctorId: 'doctor-id',
    imageUrl: '/image/url',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new GeneratePrescriptionPdfUseCase(
      prescriptionRepo as any,
      userRepo as any,
      DoctorSignatureRepository,
      pdfGenerator,
      ConfigService,
      QrService,
    );
  });

  describe('Successful cases', () => {
    it('should generate a prescription pdf', async () => {
      const buffer = Buffer.from('pdf');

      prescriptionRepo.findOneOrFail.mockResolvedValue(prescription);
      DoctorSignatureRepository.findByDoctorId.mockResolvedValue(doctorSignature);
      userRepo.findById
        .mockResolvedValueOnce({
          email: 'doctor@test.com',
        })
        .mockResolvedValueOnce({
          email: 'patient@test.com',
          documentType: 'cc',
          documentNumber: '123123123',
        });
      pdfGenerator.generatePrescription.mockResolvedValue(buffer);
      QrService.generate.mockResolvedValue('string-base64');
      ConfigService.get.mockResolvedValue('exampleDomain.com');

      const result = await useCase.execute(prescriptionId);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledWith(prescriptionId, true);

      expect(pdfGenerator.generatePrescription).toHaveBeenCalledTimes(1);
      expect(DoctorSignatureRepository.findByDoctorId).toHaveBeenCalledTimes(1);
      expect(QrService.generate).toHaveBeenCalledTimes(1);
      expect(pdfGenerator.generatePrescription).toHaveBeenCalledTimes(1);
      expect(ConfigService.get).toHaveBeenCalledTimes(1);

      expect(pdfGenerator.generatePrescription).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '2026-0001',
          doctorEmail: 'doctor@test.com',
          patientEmail: 'patient@test.com',
          notes: 'Take after meals',
        }),
      );

      expect(result).toBe(buffer);
    });
  });

  describe('Fail cases', () => {
    it('should fail if doctor does not exist', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue(prescription);
      DoctorSignatureRepository.findByDoctorId.mockResolvedValue(doctorSignature);

      userRepo.findById.mockResolvedValueOnce(null).mockResolvedValueOnce({
        email: 'patient@test.com',
      });

      await expect(useCase.execute(prescriptionId)).rejects.toThrow(DomainNotFoundError);
    });

    it('should fail if patient does not exist', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue(prescription);
      DoctorSignatureRepository.findByDoctorId.mockResolvedValue(doctorSignature);

      userRepo.findById
        .mockResolvedValueOnce({
          email: 'doctor@test.com',
        })
        .mockResolvedValueOnce(null);

      await expect(useCase.execute(prescriptionId)).rejects.toThrow(DomainNotFoundError);
    });
  });
});
