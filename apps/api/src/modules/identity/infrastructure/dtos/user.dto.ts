import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../../../../shared/domain/enums/roles.enum';
import { Transform } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';

export class QueryParam {
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

  @Length(1, 50)
  @IsString()
  @IsOptional()
  query?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit: number = 25;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page: number = 1;
}

export class QueryResponse<T> extends OmitType(QueryParam, ['role']) {
  declare limit: number;
  declare page: number;

  @IsNumber()
  total!: number;

  @IsBoolean()
  hasNextPage!: boolean;

  @IsArray()
  data!: T[];
}
