import {
  Controller,
  Get,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import type { PayloadToken } from '../../domain/types/auth.types';
import { GetUserInfoUseCase } from '../../application/use-cases/get-user-info/get-user-info.use-case';
import { AccessTokenGuard } from '../../../../shared/infrastructure/guards/accessToken.guard';
import { CurrentUser } from '../../../../shared/infrastructure/decorators/currentUser.decorator';
import { UserResponseDto } from '../dtos/auth.dto';
import { ErrorMapper } from '../mappers/error.mapper';
import { RolesGuard } from '../../../../shared/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/infrastructure/decorators/roles.decorator';
import { UserRole } from '../../../../shared/domain/enums/roles.enum';
import { CreateSignatureUseCase } from '../../application/use-cases/create-signature/use-case';
import { SignatureResponseDto } from '../dtos/signature.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../../../../shared/infrastructure/pipes/image-validator/image-validator.pipe';
import { RequiredFilePipe } from '../../../../shared/infrastructure/pipes/required-file/required-file.pipe';

@Controller('me')
export class MeController {
  constructor(
    private readonly getUserInfoUseCase: GetUserInfoUseCase,
    private readonly createSignatureUseCase: CreateSignatureUseCase,
  ) {}

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

  @ApiOperation({
    summary: 'Save signature',
  })
  @ApiResponse({
    status: 201,
    description: 'The saved signature',
    type: SignatureResponseDto,
  })
  @UseInterceptors(FileInterceptor('signature'))
  @Roles(UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @Post('signature')
  async saveSignature(
    @CurrentUser() user: PayloadToken,
    @UploadedFile(RequiredFilePipe, ImageValidationPipe) file: Express.Multer.File,
  ): Promise<SignatureResponseDto> {
    try {
      const result = await this.createSignatureUseCase.execute({
        userId: user.sub,
        buffer: file.buffer,
        filename: file.originalname,
      });
      return SignatureResponseDto.fromDomain(result);
    } catch (error) {
      throw ErrorMapper.toHttp(error);
    }
  }
}
