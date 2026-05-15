import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { GetUsersUseCase } from '../../application/use-cases/get-users/get-users.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from '../dtos/auth.dto';
import { ErrorMapper } from '../mappers/error.mapper';
import { QueryParam, QueryResponse } from '../dtos/user.dto';
import { UserInfo } from '../../domain/types/auth.types';
import { AccessTokenGuard } from '../../../../shared/infrastructure/guards/accessToken.guard';
import { RolesGuard } from '../../../../shared/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/infrastructure/decorators/roles.decorator';
import { UserRole } from '../../domain/enums/roles.enum';

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
    type: QueryResponse<UserInfo>,
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
