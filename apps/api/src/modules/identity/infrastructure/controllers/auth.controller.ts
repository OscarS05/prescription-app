import { Body, Controller, Delete, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';

import { LoginUseCase } from '../../application/use-cases/login/login.use-case';
import { RefreshSessionUseCase } from '../../application/use-cases/refresh-session/refresh-session.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout/logout.use-case';
import { LoginDto, UserResponseDto } from '../dtos/auth.dto';
import { clearCookie, setCookie } from '../helpers/cookie.helper';
import { Public } from '../../../../shared/infrastructure/decorators/public.decorator';
import { RefreshToken } from '../decorators/refreshToken.decorator';
import { AccessTokenGuard } from '../../../../shared/infrastructure/guards/accessToken.guard';
import { CurrentUser } from '../../../../shared/infrastructure/decorators/currentUser.decorator';
import type { PayloadToken } from '../../domain/types/auth.types';
import { ErrorMapper } from '../mappers/error.mapper';
import { RefreshTokenGuard } from '../../../../shared/infrastructure/guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @ApiOperation({
    summary: 'Login',
    description: 'User login with email and password',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Information about the saved user',
    type: UserResponseDto,
  })
  @HttpCode(200)
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    try {
      const { tokens, user } = await this.loginUseCase.execute(loginDto);
      setCookie(res, 'refreshToken', tokens.refreshToken);
      setCookie(res, 'accessToken', tokens.accessToken);

      return UserResponseDto.fromDomain(user);
    } catch (error) {
      throw ErrorMapper.toHttp(error);
    }
  }

  @ApiOperation({
    summary: 'Refresh session',
    description: 'Refresh the user session using the refresh token',
  })
  @ApiResponse({
    status: 204,
    description: 'Tokens saved in cookies',
  })
  @HttpCode(204)
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @RefreshToken() refreshToken: string,
    @CurrentUser() user: PayloadToken,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    try {
      const tokens = await this.refreshSessionUseCase.execute(user, refreshToken);
      setCookie(res, 'refreshToken', tokens.refreshToken);
      setCookie(res, 'accessToken', tokens.accessToken);
    } catch (error) {
      throw ErrorMapper.toHttp(error);
    }
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Logout the user and invalidate the refresh token',
  })
  @ApiResponse({
    status: 204,
    description: 'Tokens invalidated and deleted from cookies',
  })
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  @Delete('session')
  async logout(
    @CurrentUser() user: PayloadToken,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    try {
      await this.logoutUseCase.execute(user);
      clearCookie(res, 'refreshToken');
      clearCookie(res, 'accessToken');
    } catch (error) {
      throw ErrorMapper.toHttp(error);
    }
  }
}
