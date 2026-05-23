import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import type { PayloadToken } from '../../domain/types/auth.types';
import { GetUserInfoUseCase } from '../../application/use-cases/get-user-info/get-user-info.use-case';
import { AccessTokenGuard } from '../../../../shared/infrastructure/guards/accessToken.guard';
import { CurrentUser } from '../../../../shared/infrastructure/decorators/currentUser.decorator';
import { UserResponseDto } from '../dtos/auth.dto';
import { ErrorMapper } from '../mappers/error.mapper';

@Controller('me')
export class MeController {
  constructor(private readonly getUserInfoUseCase: GetUserInfoUseCase) {}

  @ApiOperation({
    summary: 'User information',
    description: 'Get the information of the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Information about the current user',
    type: UserResponseDto,
  })
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getUser(@CurrentUser() user: PayloadToken) {
    try {
      return this.getUserInfoUseCase.execute(user.sub);
    } catch (error) {
      throw ErrorMapper.toHttp(error);
    }
  }
}
