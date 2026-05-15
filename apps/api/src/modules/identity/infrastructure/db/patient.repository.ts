import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { PatientRepository } from '../../domain/ports/patient.repository';
import { CreatePatient, Patient } from '../../domain/types/patient.types';
import { PatientMapper } from '../mappers/patient.mapper';

@Injectable()
export class PatientRepositoryPrismaAdapter extends PatientRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(userId: string): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });
    return patient ? PatientMapper.toDomain(patient) : null;
  }

  async create(data: CreatePatient): Promise<Patient> {
    const patient = await this.prisma.patient.create({
      data,
    });
    return PatientMapper.toDomain(patient);
  }
}
