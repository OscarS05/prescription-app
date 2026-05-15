import { Type } from 'class-transformer';
import { IsDate, IsEmpty, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class PatientDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @Length(4, 50)
  @IsString()
  @IsEmpty()
  speciality!: string;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;
}
