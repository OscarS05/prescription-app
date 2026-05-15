import { Type } from 'class-transformer';
import { IsDate, IsEmpty, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import { Doctor } from '../../domain/types/doctor.types';

export class DoctorDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @Length(4, 50)
  @IsString()
  @IsEmpty()
  specialty!: string | null;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;
}

export class DoctorResponseDto extends DoctorDto {
  static fromDomain(doctor: Doctor): DoctorResponseDto {
    const dto = new DoctorResponseDto();
    dto.userId = doctor.userId;
    dto.specialty = doctor.specialty;
    dto.createdAt = doctor.createdAt;
    dto.updatedAt = doctor.updatedAt;
    return dto;
  }
}
