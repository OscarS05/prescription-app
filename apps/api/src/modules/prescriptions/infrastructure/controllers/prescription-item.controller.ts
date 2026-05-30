import { Controller } from '@nestjs/common';
import { DeletePrescriptionItemUseCase } from '../../application/use-cases/delete-prescription-item/delete-prescription-item.use-case';

@Controller('prescriptions/:id/')
export class PrescriptionItemController {
  constructor(
    private readonly deletePrescriptionItemUseCase: DeletePrescriptionItemUseCase,
  ) {}
}
