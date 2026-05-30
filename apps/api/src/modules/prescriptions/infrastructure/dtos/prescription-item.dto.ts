import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { PrescriptionItem } from '../../domain/types/prescription-items.type';
import { OmitType } from '@nestjs/swagger';

export class PrescriptionItemDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsUUID()
  @IsNotEmpty()
  prescriptionId!: string;

  @Length(3, 100)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Length(3, 100)
  @IsString()
  @IsOptional()
  dosage: string | null = null;

  @Length(3, 100)
  @IsNumber()
  @IsOptional()
  quantity: number | null = null;

  @Length(3, 500)
  @IsString()
  @IsOptional()
  instructions: string | null = null;
}

export class PrescriptionItemResponseDto extends PrescriptionItemDto {
  static fromDomain(data: PrescriptionItem): PrescriptionItemResponseDto {
    const dto = new PrescriptionItemResponseDto();
    dto.id = data.id;
    dto.prescriptionId = data.prescriptionId;
    dto.name = data.name;
    dto.dosage = data.dosage;
    dto.quantity = data.quantity;
    dto.instructions = data.instructions;
    return dto;
  }
}

export class DeletePrescriptionItemsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  ids!: string[];
}

export class CreatePrescriptionItemDto extends OmitType(PrescriptionItemDto, [
  'id',
  'prescriptionId',
]) {}

export class EditPrescriptionItemDto extends OmitType(PrescriptionItemDto, [
  'prescriptionId',
]) {}
