import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../../shared/domain/enums/roles.enum';
import { Transform } from 'class-transformer';
import { QueryParam } from '../../../../shared/infrastructure/dto/filters.dto';

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
