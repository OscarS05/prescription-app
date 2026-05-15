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
import type { DocumentType } from '../../domain/types/auth.types';
import { UserRole } from '../../domain/enums/roles.enum';
import { DoctorDto } from './doctor.dto';
import { PatientDto } from './patient.dto';

export class UserBaseDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @Length(8, 35)
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
]) {}
