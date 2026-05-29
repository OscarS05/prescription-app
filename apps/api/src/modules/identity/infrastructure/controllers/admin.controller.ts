import { Body, Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { GetUsersUseCase } from '../../application/use-cases/get-users/get-users.use-case';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto, UserResponseDto } from '../dtos/auth.dto';
import { ErrorMapper } from '../mappers/error.mapper';
import { UserQueryParam } from '../dtos/user.dto';
import { UserInfo } from '../../domain/types/auth.types';
import { AccessTokenGuard } from '../../../../shared/infrastructure/guards/accessToken.guard';
import { RolesGuard } from '../../../../shared/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/infrastructure/decorators/roles.decorator';
import { UserRole } from '../../../../shared/domain/enums/roles.enum';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { QueryResponse } from '../../../../shared/infrastructure/dto/filters.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

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
  @Get('users')
  async getUsers(@Query() params: UserQueryParam): Promise<QueryResponse<UserInfo>> {
    try {
      const result = await this.getUsersUseCase.execute({
        ...params,
        query: params.query || '',
        roles: params.role,
      });

      return {
        ...result,
        data: result.data.map((u) => UserResponseDto.fromDomain(u)),
      };
    } catch (error) {
      throw ErrorMapper.toHttp(error);
    }
  }

  @ApiOperation({
    summary: 'Create a user',
    description: 'Create a new user account from admin panel.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Information about the saved user',
    type: UserResponseDto,
  })
  @HttpCode(201)
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('users')
  async create(@Body() registerDto: RegisterDto): Promise<UserInfo> {
    try {
      const user = await this.createUserUseCase.execute(registerDto);
      return user;
    } catch (error) {
      throw ErrorMapper.toHttp(error);
    }
  }
}
