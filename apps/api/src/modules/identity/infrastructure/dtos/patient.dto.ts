import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';
import { Patient } from '../../domain/types/patient.types';

export class PatientDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @Type(() => Date)
  @IsDate()
  birthDate!: Date | null;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;
}

export class PatientResponseDto extends PatientDto {
  static fromDomain(patient: Patient): PatientResponseDto {
    const dto = new PatientResponseDto();
    dto.userId = patient.userId;
    dto.birthDate = patient.birthDate;
    dto.createdAt = patient.createdAt;
    dto.updatedAt = patient.updatedAt;
    return dto;
  }
}
