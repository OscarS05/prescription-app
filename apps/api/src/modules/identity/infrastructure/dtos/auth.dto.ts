import { ApiHideProperty, OmitType, PickType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import type { DocumentType, UserInfo } from '../../domain/types/auth.types';
import { UserRole } from '../../../../shared/domain/enums/roles.enum';
import { DoctorDto, DoctorResponseDto } from './doctor.dto';
import { PatientDto, PatientResponseDto } from './patient.dto';

export class UserBaseDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @Length(5, 35)
  @Matches(/^[^\s]+$/)
  password!: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;

  @ApiHideProperty()
  @Exclude()
  @IsString()
  refreshTokenHashed!: string;

  @IsNotEmpty()
  documentType!: DocumentType;

  @IsString()
  @Length(4, 32)
  documentNumber!: string;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;

  doctor?: DoctorDto;
  patient?: PatientDto;
}

export class LoginDto extends PickType(UserBaseDto, ['email', 'password']) {}
export class RegisterDto extends PickType(UserBaseDto, [
  'documentNumber',
  'documentType',
  'email',
  'password',
  'role',
]) {}

export class UserResponseDto extends OmitType(UserBaseDto, [
  'password',
  'refreshTokenHashed',
]) {
  static fromDomain(user: UserInfo): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      documentType: user.documentType,
      documentNumber: user.documentNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      doctor: user.doctor ? DoctorResponseDto.fromDomain(user.doctor) : undefined,
      patient: user.patient ? PatientResponseDto.fromDomain(user.patient) : undefined,
    };
  }
}
