// prescription.repository.int.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { PrismaPrescriptionRepository } from '../../../src/modules/prescriptions/infrastructure/repositories/prescription.repository';
import { UserRole } from '../../../src/shared/domain/enums/roles.enum';
import { PrismaTransactionContext } from '../../../src/shared/infrastructure/prisma/transaction-context';
import { PrescriptionStatus } from '../../../src/modules/prescriptions/domain/enums/prescription-status.enum';
import { seedDoctor } from '../../../prisma/seeders/doctor.seed';
import { seedPatient } from '../../../prisma/seeders/patient.seed';
import { seedPrescriptions } from '../../../prisma/seeders/prescription.seed';

describe('PrismaPrescriptionRepository Integration', () => {
  let repository: PrismaPrescriptionRepository;
  let prisma: PrismaService;

  let doctorId: string;
  let patientId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, PrismaPrescriptionRepository, PrismaTransactionContext],
    }).compile();

    repository = module.get(PrismaPrescriptionRepository);
    prisma = module.get(PrismaService);

    doctorId = await seedDoctor();
    patientId = await seedPatient();
  });

  afterEach(async () => {
    await prisma.prescriptionItem.deleteMany();

    await prisma.prescription.deleteMany();
  });

  afterAll(async () => {
    await prisma.prescription.deleteMany();
    await prisma.prescriptionItem.deleteMany();
    await prisma.$disconnect();
  });

  describe('create()', () => {
    it('should create prescription successfully', async () => {
      const prescription = await repository.create({
        doctorId,
        patientId,
        code: 'INT-001',
        notes: 'integration test',
        status: PrescriptionStatus.PENDING,
      });

      expect(prescription.id).not.toBeNull();
      expect(prescription.code).toBe('INT-001');
    });
  });

  describe('findOneOrFail()', () => {
    it('should find prescription by id', async () => {
      const created = await prisma.prescription.create({
        data: {
          doctorId,
          patientId,
          code: 'INT-002',
          notes: 'find by id',
          status: PrescriptionStatus.PENDING,
        },
      });

      const prescription = await repository.findOneOrFail(created.id, false);

      expect(prescription.id).toBe(created.id);
      expect(prescription.items).toBeUndefined();
    });

    it('should find prescription by code', async () => {
      await prisma.prescription.create({
        data: {
          doctorId,
          patientId,
          code: 'INT-003',
          notes: 'find by code',
          status: PrescriptionStatus.PENDING,
        },
      });

      const prescription = await repository.findOneOrFail('INT-003', false);

      expect(prescription.code).toBe('INT-003');
      expect(prescription.items).toBeUndefined();
    });

    it('should find prescription by code', async () => {
      await prisma.prescription.create({
        data: {
          doctorId,
          patientId,
          code: 'INT-003',
          notes: 'find by code',
          status: PrescriptionStatus.PENDING,
        },
      });

      const prescription = await repository.findOneOrFail('INT-003', true);

      expect(prescription.code).toBe('INT-003');
      expect(prescription.items).toEqual([]);
    });
  });

  describe('update()', () => {
    it('should update prescription', async () => {
      const created = await prisma.prescription.create({
        data: {
          doctorId,
          patientId,
          code: 'INT-004',
          notes: 'before update',
          status: PrescriptionStatus.PENDING,
        },
      });

      const updated = await repository.update(created.id, {
        notes: 'updated',
      });

      expect(updated.notes).toBe('updated');
    });
  });

  describe('markAsConsumed()', () => {
    it('should mark prescription as consumed', async () => {
      const created = await prisma.prescription.create({
        data: {
          doctorId,
          patientId,
          code: 'INT-005',
          notes: 'consume',
          status: PrescriptionStatus.PENDING,
        },
      });

      await repository.markAsConsumed(created.id);

      const prescription = await prisma.prescription.findUnique({
        where: { id: created.id },
      });

      expect(prescription?.status).toBe(PrescriptionStatus.CONSUMED);
    });
  });

  describe('delete()', () => {
    it('should soft delete prescription', async () => {
      const created = await prisma.prescription.create({
        data: {
          doctorId,
          patientId,
          code: 'INT-006',
          notes: 'delete',
          status: PrescriptionStatus.PENDING,
        },
      });

      await repository.delete(created.id);

      const prescription = await prisma.prescription.findUnique({
        where: { id: created.id },
      });

      expect(prescription?.deletedAt).not.toBeNull();
    });
  });

  describe('findAll()', () => {
    it('should find all prescriptions', async () => {
      await prisma.prescription.createMany({
        data: [
          {
            doctorId,
            patientId,
            code: 'INT-007',
            notes: 'one',
            status: PrescriptionStatus.PENDING,
          },
          {
            doctorId,
            patientId,
            code: 'INT-008',
            notes: 'two',
            status: PrescriptionStatus.PENDING,
          },
        ],
      });

      const [data, total] = await repository.findAll(UserRole.DOCTOR, doctorId, {
        limit: 10,
        offset: 0,
        order: 'DESC',
      });

      expect(total).toBe(2);
      expect(data.length).toBe(2);
    });
  });

  describe('findTheLastCode()', () => {
    it('should return last prescription code', async () => {
      await prisma.prescription.create({
        data: {
          doctorId,
          patientId,
          code: 'INT-999',
          status: PrescriptionStatus.PENDING,
        },
      });
      await prisma.prescription.create({
        data: {
          doctorId,
          patientId,
          code: 'INT-998',
          status: PrescriptionStatus.PENDING,
        },
      });

      const code = await repository.findTheLastCode();

      expect(code).toBe('INT-998');
    });
  });

  describe('getMetrics()', () => {
    it('should return prescription metrics', async () => {
      await seedPrescriptions({ doctorId, patientId, adminId: '123' });

      const result = await repository.getMetrics({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      });

      expect(result.totalPrescriptions).toBe(8);
      expect(result.prescriptionsInPeriod).toBe(8);
      expect(result.byStatus.pending).toBe(5);
      expect(result.byStatus.consumed).toBe(3);
      expect(result.prescriptionsPerDay.length).toBe(1);
      expect(result.prescriptionsPerDay[0].count).toBe(8);
      expect(result.topDoctors.length).toBe(1);
      expect(result.topDoctors[0].doctorId).toBe(doctorId);
    });
  });
});
