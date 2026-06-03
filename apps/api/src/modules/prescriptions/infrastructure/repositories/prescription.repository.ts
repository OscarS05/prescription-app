import { Injectable } from '@nestjs/common';
import { PrescriptionStatus, Prisma } from '@prisma/client';
import { Prescription as PrescriptionORM } from '@prisma/client';

import { PrismaRepository } from '../../../../shared/infrastructure/prisma/base.repository';
import { PrescriptionRepository } from '../../domain/ports/prescription.repository';
import {
  CreatePrescription,
  Prescription,
  PrescriptionQueryFilters,
  UpdatePrescription,
} from '../../domain/types/prescription.types';
import { PrescriptionMapper } from '../mappers/prescription.mapper';
import { PrescriptionNotFound } from '../../domain/errors/prescription.errors';
import { UserRole } from '../../../../shared/domain/enums/roles.enum';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { PrismaTransactionContext } from '../../../../shared/infrastructure/prisma/transaction-context';
import {
  AdminMetricsRequest,
  PrescriptionMetrics,
} from '../../../identity/domain/types/admin.types';

@Injectable()
export class PrismaPrescriptionRepository
  extends PrismaRepository
  implements PrescriptionRepository
{
  constructor(prisma: PrismaService, txContext: PrismaTransactionContext) {
    super(prisma, txContext);
  }

  async create(data: CreatePrescription): Promise<Prescription> {
    const prescription = await this.client.prescription.create({ data });

    return PrescriptionMapper.toDomain(prescription);
  }

  async update(id: string, data: UpdatePrescription): Promise<Prescription> {
    const prescription = await this.client.prescription.update({
      where: { id, deletedAt: null },
      data: { notes: data.notes },
    });

    return PrescriptionMapper.toDomain(prescription);
  }

  async markAsConsumed(id: string): Promise<void> {
    await this.client.prescription.update({
      where: { id, deletedAt: null },
      data: { status: PrescriptionStatus.consumed },
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.prescription.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findTheLastCode(): Promise<string> {
    const result = await this.client.prescription.findFirst({
      select: { code: true },
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!result) throw new PrescriptionNotFound();

    return result.code;
  }

  async findOneOrFail(key: string, includeItems: boolean): Promise<Prescription> {
    let result: PrescriptionORM | null = null;
    const where = {
      deletedAt: null,
      OR: [{ id: key }, { code: key }],
    };

    if (includeItems) {
      result = await this.client.prescription.findFirst({
        where,
        include: {
          items: true,
        },
      });
    } else {
      result = await this.client.prescription.findFirst({ where });
    }

    if (!result) throw new PrescriptionNotFound();

    return PrescriptionMapper.toDomain(result);
  }

  async findAll(
    userRole: UserRole,
    profileId: string,
    filters: PrescriptionQueryFilters,
  ): Promise<[Prescription[], number]> {
    const {
      limit,
      offset,
      order,
      code,
      createdAtFrom,
      createdAtTo,
      doctorId,
      patientId,
      status,
    } = filters;

    const where = {
      deletedAt: null,
      ...(userRole === UserRole.DOCTOR && { doctorId: profileId }),
      ...(userRole === UserRole.PATIENT && { patientId: profileId }),
      ...(doctorId ? { doctorId: doctorId } : {}),
      ...(patientId ? { patientId: patientId } : {}),
      ...(code ? { code: { contains: code, mode: Prisma.QueryMode.insensitive } } : {}),
      ...(status ? { status: status } : {}),
      ...(createdAtFrom || createdAtTo
        ? {
            createdAt: {
              ...(createdAtFrom ? { gte: createdAtFrom } : {}),
              ...(createdAtTo ? { lte: createdAtTo } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.client.prescription.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: order === 'DESC' ? 'desc' : 'asc' },
      }),
      this.client.prescription.count({ where }),
    ]);

    return [data.map((p) => PrescriptionMapper.toDomain(p)), total];
  }

  async getMetrics(filters: AdminMetricsRequest): Promise<PrescriptionMetrics> {
    const { from, to } = filters;

    const [
      totalPrescriptions,
      prescriptionsInPeriod,
      prescriptionsByStatus,
      prescriptionsByDate,
      prescriptionsByDoctor,
    ] = await Promise.all([
      this.client.prescription.count({
        where: {
          deletedAt: null,
        },
      }),

      this.client.prescription.count({
        where: {
          deletedAt: null,
          createdAt: {
            gte: from,
            lte: to,
          },
        },
      }),

      this.client.prescription.groupBy({
        by: ['status'],
        where: {
          deletedAt: null,
          createdAt: {
            gte: from,
            lte: to,
          },
        },
        _count: {
          status: true,
        },
      }),

      this.client.$queryRaw<{ date: Date; count: number }[]>`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as count
        FROM prescriptions
        WHERE
          deleted_at IS NULL
          AND created_at >= ${from}
          AND created_at <= ${to}
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC
      `,

      this.client.prescription.groupBy({
        by: ['doctorId'],
        where: {
          deletedAt: null,
          createdAt: {
            gte: from,
            lte: to,
          },
        },
        _count: true,
        orderBy: {
          _count: {
            doctorId: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    const topDoctors = await this.client.doctor.findMany({
      where: {
        userId: {
          in: prescriptionsByDoctor.map((p) => p.doctorId),
        },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    const doctorsMap = new Map(topDoctors.map((d) => [d.userId, d]));

    return {
      totalPrescriptions,
      prescriptionsInPeriod,

      byStatus: {
        pending:
          prescriptionsByStatus.find((p) => p.status === PrescriptionStatus.pending)?._count
            .status || 0,
        consumed:
          prescriptionsByStatus.find((p) => p.status === PrescriptionStatus.consumed)?._count
            .status || 0,
      },

      prescriptionsPerDay: prescriptionsByDate.map((p) => ({
        date: p.date.toISOString().split('T')[0],
        count: Number(p.count),
      })),

      topDoctors: prescriptionsByDoctor.map((p) => {
        const doctor = doctorsMap.get(p.doctorId);

        return {
          doctorId: p.doctorId,
          doctorEmail: doctor?.user.email ?? '',
          prescriptions: p._count,
        };
      }),
    };
  }
}
