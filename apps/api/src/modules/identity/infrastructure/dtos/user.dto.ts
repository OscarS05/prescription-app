import { IsArray, IsDate, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../../shared/domain/enums/roles.enum';
import { Transform, Type } from 'class-transformer';
import { QueryParam } from '../../../../shared/infrastructure/dto/filters.dto';
import {
  AdminMetricsRequest,
  TopDoctorMetrics,
  TotalPrescriptionByStatus,
  TotalPrescriptionMetrics,
  TotalPrescriptionsPerDay,
  TotalUserMetrics,
} from '../../domain/types/admin.types';

export class UserQueryParam extends QueryParam {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (!value) return [];
    if (typeof value !== 'string') return null;

    if (Array.isArray(value)) return value;

    return value.split('|');
  })
  @IsArray()
  @IsEnum(UserRole, { each: true })
  role!: UserRole[];
}

export class UserQueryParamForMetrics {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;
}

export class AdminMetricsResponseDto {
  period!: { from: string; to: string };
  totals!: TotalUserMetrics & TotalPrescriptionMetrics;

  byStatus!: TotalPrescriptionByStatus;

  prescriptionsPerDay!: TotalPrescriptionsPerDay[];

  topDoctors!: TopDoctorMetrics[];
}
