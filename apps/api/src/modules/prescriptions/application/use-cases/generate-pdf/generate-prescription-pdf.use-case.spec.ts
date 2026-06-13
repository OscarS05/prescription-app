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

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new GeneratePrescriptionPdfUseCase(
      prescriptionRepo as any,
      userRepo as any,
      pdfGenerator,
    );
  });

  describe('Successful cases', () => {
    it('should generate a prescription pdf', async () => {
      const buffer = Buffer.from('pdf');

      prescriptionRepo.findOneOrFail.mockResolvedValue(prescription);

      userRepo.findById
        .mockResolvedValueOnce({
          email: 'doctor@test.com',
        })
        .mockResolvedValueOnce({
          email: 'patient@test.com',
        });

      pdfGenerator.generatePrescription.mockResolvedValue(buffer);

      const result = await useCase.execute(prescriptionId);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledWith(prescriptionId, true);

      expect(pdfGenerator.generatePrescription).toHaveBeenCalledTimes(1);

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

      userRepo.findById.mockResolvedValueOnce(null).mockResolvedValueOnce({
        email: 'patient@test.com',
      });

      await expect(useCase.execute(prescriptionId)).rejects.toThrow(DomainNotFoundError);
    });

    it('should fail if patient does not exist', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue(prescription);

      userRepo.findById
        .mockResolvedValueOnce({
          email: 'doctor@test.com',
        })
        .mockResolvedValueOnce(null);

      await expect(useCase.execute(prescriptionId)).rejects.toThrow(DomainNotFoundError);
    });
  });
});
