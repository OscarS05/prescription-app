import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { GetUsersUseCase } from '../../application/use-cases/get-users/get-users.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from '../dtos/auth.dto';
import { ErrorMapper } from '../mappers/error.mapper';
import { QueryParam, QueryResponse } from '../dtos/user.dto';
import { UserInfo } from '../../domain/types/auth.types';

@Controller('users')
export class UsersController {
  constructor(private readonly getUsersUseCase: GetUsersUseCase) {}

  @ApiOperation({
    summary: 'Get Users',
    description: 'Retrieve a list of all users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserResponseDto],
  })
  @HttpCode(200)
  @Get()
  async getUsers(@Query() query: QueryParam): Promise<QueryResponse<UserInfo>> {
    try {
      const result = await this.getUsersUseCase.execute({
        ...query,
        query: query.query || '',
      });

      return {
        ...result,
        data: result.data.map((u) => UserResponseDto.fromDomain(u)),
      };
    } catch (error) {
      throw ErrorMapper.toHttp(error);
    }
  }
}
