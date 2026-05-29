import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { PrescriptionStatus } from '../../domain/enums/prescription-status.enum';
import { PresciptionItemResponseDto, PrescriptionItemDto } from './prescription-item.dto';
import { Prescription } from '../../domain/types/prescription.types';
import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { QueryParam } from '../../../../shared/infrastructure/dto/filters.dto';

export class PrescriptionDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsUUID()
  @IsNotEmpty()
  patientId!: string;

  @IsUUID()
  @IsNotEmpty()
  doctorId!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsNotEmpty()
  @IsEnum(PrescriptionStatus)
  status!: PrescriptionStatus;

  @Length(3, 255)
  @IsOptional()
  @IsString()
  notes: string | null = null;

  @Type(() => Date)
  @IsDate()
  consumedAt: Date | null = null;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;

  items!: PrescriptionItemDto[];
}

export class PrescriptionResponseDto extends PrescriptionDto {
  static fromDomain(data: Prescription): PrescriptionResponseDto {
    const dto = new PrescriptionResponseDto();
    dto.id = data.id;
    dto.patientId = data.patientId;
    dto.doctorId = data.doctorId;
    dto.code = data.code;
    dto.status = data.status;
    dto.notes = data.notes;
    dto.consumedAt = data.consumedAt;
    dto.createdAt = data.createdAt;
    dto.updatedAt = data.updatedAt;
    dto.items = data.items?.map((item) => PresciptionItemResponseDto.fromDomain(item)) || [];
    return dto;
  }
}

export class CreatePrescriptionDto extends PickType(PrescriptionDto, [
  'patientId',
  'doctorId',
  'notes',
  'items',
]) {}

export class EditPrescriptionDto extends PartialType(
  PickType(PrescriptionDto, ['notes', 'items']),
) {}

export class PrescriptionQueryParams extends OmitType(QueryParam, ['query']) {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAtFrom?: Date | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAtTo?: Date | null;

  @Length(4, 255)
  @IsOptional()
  @IsString()
  code?: string | null;

  @IsOptional()
  @IsEnum(PrescriptionStatus, { each: true })
  status?: PrescriptionStatus | null;

  @IsOptional()
  @IsUUID()
  doctorId?: string | null;

  @IsOptional()
  @IsUUID()
  patientId?: string | null;
}
