import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class DoctorDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @Type(() => Date)
  @IsDate()
  birthDate!: string;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;
}
