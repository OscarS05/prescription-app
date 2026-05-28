import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user.repository';
import { UserQueryParams, User } from '../../../domain/types/auth.types';
import { SearchResponse } from '../../../../../shared/domain/types/query-params.types';

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  public async execute(query: UserQueryParams): Promise<SearchResponse<User>> {
    const normalizedLimit = Math.min(query.limit, 15);
    const offset = (query.page - 1) * normalizedLimit;

    const [users, total] = await this.usersRepository.findAll({
      offset,
      limit: normalizedLimit,
      query: query.query,
      roles: query.roles,
      order: 'DESC',
    });

    return {
      data: users,
      page: query.page,
      limit: normalizedLimit,
      total,
      hasNextPage: query.page * normalizedLimit < total,
    };
  }
}
