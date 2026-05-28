import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { PrismaTransactionContext } from '../../../src/shared/infrastructure/prisma/transaction-context';
import { PrismaPrescriptionItemRepository } from '../../../src/modules/prescriptions/infrastructure/repositories/prescription-item.repository';
import { runSeeds } from '../../../prisma/main.seed';

describe('PrismaPrescriptionItemRepository Integration', () => {
  let repository: PrismaPrescriptionItemRepository;
  let prisma: PrismaService;

  let prescriptionId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, PrismaTransactionContext, PrismaPrescriptionItemRepository],
    }).compile();

    repository = module.get(PrismaPrescriptionItemRepository);
    prisma = module.get(PrismaService);

    await runSeeds();

    const prescription = await prisma.prescription.findFirst();
    if (!prescription) throw new Error('Prescription ID is required');
    prescriptionId = prescription.id;

    await prisma.prescriptionItem.deleteMany({ where: { prescriptionId } });
  });

  afterEach(async () => {
    await prisma.prescriptionItem.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create()', () => {
    it('should create prescription items successfully', async () => {
      const items = await repository.create([
        {
          prescriptionId,
          name: 'Ibuprofen',
          dosage: '500mg',
          quantity: 10,
          instructions: 'after meals',
        },
      ]);

      expect(items.length).toBe(1);
      expect(items[0]?.name).toBe('Ibuprofen');
    });
  });

  describe('update()', () => {
    it('should update prescription items successfully', async () => {
      const created = await prisma.prescriptionItem.create({
        data: {
          prescriptionId,
          name: 'Paracetamol',
          dosage: '500mg',
          quantity: 5,
          instructions: 'before sleep',
        },
      });

      const items = await repository.update([
        {
          id: created.id,
          name: 'Updated',
          dosage: '1g',
          quantity: 20,
          instructions: 'updated instructions',
        },
      ]);

      expect(items.length).toBe(1);
      expect(items[0]?.name).toBe('Updated');
      expect(items[0]?.dosage).toBe('1g');
    });
  });

  describe('delete()', () => {
    it('should delete prescription items successfully', async () => {
      const created = await prisma.prescriptionItem.create({
        data: {
          prescriptionId,
          name: 'Delete me',
          dosage: '500mg',
        },
      });

      await repository.delete([created.id]);

      const item = await prisma.prescriptionItem.findUnique({
        where: {
          id: created.id,
        },
      });

      expect(item).toBeNull();
    });
  });
});
