import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';

export class QueryParam {
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

  @IsOptional()
  @IsString()
  @IsIn(['DESC', 'ASC'])
  order: 'DESC' | 'ASC' = 'DESC';
}

export class QueryResponse<T> extends OmitType(QueryParam, ['order']) {
  declare limit: number;
  declare page: number;

  @IsNumber()
  total!: number;

  @IsBoolean()
  hasNextPage!: boolean;

  @IsArray()
  data!: T[];
}
