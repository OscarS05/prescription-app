import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { PrescriptionItem } from '../../domain/types/prescription-items.type';

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

export class PresciptionItemResponseDto extends PrescriptionItemDto {
  static fromDomain(data: PrescriptionItem): PresciptionItemResponseDto {
    const dto = new PresciptionItemResponseDto();
    dto.id = data.id;
    dto.prescriptionId = data.prescriptionId;
    dto.name = data.name;
    dto.dosage = data.dosage;
    dto.quantity = data.quantity;
    dto.instructions = data.instructions;
    return dto;
  }
}
