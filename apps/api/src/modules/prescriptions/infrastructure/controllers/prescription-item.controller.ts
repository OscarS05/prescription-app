import { Body, Controller, Delete, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { DeletePrescriptionItemUseCase } from '../../application/use-cases/delete-prescription-item/delete-prescription-item.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../../../../shared/infrastructure/decorators/roles.decorator';
import { UserRole } from '../../../../shared/domain/enums/roles.enum';
import { RolesGuard } from '../../../../shared/infrastructure/guards/roles.guard';
import { CurrentUser } from '../../../../shared/infrastructure/decorators/currentUser.decorator';
import type { PayloadToken } from '../../../identity/domain/types/auth.types';
import { ErrorMapper } from '../mappers/errors.mappers';
import {
  CreatePrescriptionItemDto,
  DeletePrescriptionItemsDto,
  PrescriptionItemResponseDto,
} from '../dtos/prescription-item.dto';
import { CreatePrescriptionItemUseCase } from '../../application/use-cases/create-prescription-item/create-item.use-case';

@Controller('prescriptions/:prescriptionId/items')
export class PrescriptionItemController {
  constructor(
    private readonly deletePrescriptionItemUseCase: DeletePrescriptionItemUseCase,
    private readonly createPrescriptionItemUseCase: CreatePrescriptionItemUseCase,
  ) {}

  @ApiOperation({
    summary: 'Create a prescription item',
  })
  @ApiResponse({
    status: 201,
    type: PrescriptionItemResponseDto,
  })
  @Roles(UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @HttpCode(201)
  @Post()
  async create(
    @CurrentUser() user: PayloadToken,
    @Param('prescriptionId') id: string,
    @Body() body: CreatePrescriptionItemDto,
  ): Promise<PrescriptionItemResponseDto> {
    try {
      const result = await this.createPrescriptionItemUseCase.execute(user.sub, {
        ...body,
        prescriptionId: id,
      });
      return PrescriptionItemResponseDto.fromDomain(result);
    } catch (error) {
      ErrorMapper.toHttp(error);
    }
  }

  @ApiOperation({
    summary: 'Delete a prescription item',
  })
  @ApiResponse({
    status: 204,
  })
  @Roles(UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @HttpCode(204)
  @Delete()
  async delete(
    @CurrentUser() user: PayloadToken,
    @Param('prescriptionId') id: string,
    @Body() body: DeletePrescriptionItemsDto,
  ): Promise<void> {
    try {
      await this.deletePrescriptionItemUseCase.execute(user.sub, id, body.ids);
    } catch (error) {
      ErrorMapper.toHttp(error);
    }
  }
}
