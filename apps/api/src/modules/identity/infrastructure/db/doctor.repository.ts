import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { DoctorRepository } from '../../domain/ports/doctor.repository';
import { CreateDoctor, Doctor } from '../../domain/types/doctor.types';
import { DoctorMapper } from '../mappers/doctor.mapper';

@Injectable()
export class DoctorRepositoryPrismaAdapter extends DoctorRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(userId: string): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });
    return doctor ? DoctorMapper.toDomain(doctor) : null;
  }

  async create(data: CreateDoctor): Promise<Doctor> {
    const doctor = await this.prisma.doctor.create({
      data,
    });
    return DoctorMapper.toDomain(doctor);
  }
}
