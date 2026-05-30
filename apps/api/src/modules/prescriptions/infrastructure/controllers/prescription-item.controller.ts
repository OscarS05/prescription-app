import { Body, Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { DeletePrescriptionItemUseCase } from '../../application/use-cases/delete-prescription-item/delete-prescription-item.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../../../../shared/infrastructure/decorators/roles.decorator';
import { UserRole } from '../../../../shared/domain/enums/roles.enum';
import { RolesGuard } from '../../../../shared/infrastructure/guards/roles.guard';
import { CurrentUser } from '../../../../shared/infrastructure/decorators/currentUser.decorator';
import type { PayloadToken } from '../../../identity/domain/types/auth.types';
import { ErrorMapper } from '../mappers/errors.mappers';
import { DeletePrescriptionItemsDto } from '../dtos/prescription-item.dto';

@Controller('prescriptions/:prescriptionId/items')
export class PrescriptionItemController {
  constructor(
    private readonly deletePrescriptionItemUseCase: DeletePrescriptionItemUseCase,
  ) {}

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
