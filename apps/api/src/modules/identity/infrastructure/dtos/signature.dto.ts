import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { DoctorDto } from './doctor.dto';
import { DoctorSignature } from '../../domain/types/signatures.types';

export class SignatureBaseDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsUUID()
  @IsNotEmpty()
  doctorId!: string;

  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;

  doctor?: DoctorDto;
}

export class SignatureResponseDto extends SignatureBaseDto {
  static fromDomain(data: DoctorSignature): SignatureResponseDto {
    return {
      id: data.id,
      doctorId: data.doctorId,
      imageUrl: data.imageUrl,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
