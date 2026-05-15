import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user.repository';
import { QueryParams, SearchResponse, User } from '../../../domain/types/auth.types';

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  public async execute(query: QueryParams): Promise<SearchResponse<User>> {
    const normalizedLimit = Math.min(query.limit, 15);
    const offset = (query.page - 1) * normalizedLimit;

    const [users, total] = await this.usersRepository.findAll({
      offset,
      limit: normalizedLimit,
      query: query.query,
      roles: query.role,
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
