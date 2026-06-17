import { Injectable } from '@nestjs/common';
import { DoctorSignatureRepository } from '../../../domain/ports/signature.repository';
import { ImageService } from '../../../../../shared/domain/ports/image.service';
import { UnitOfWorkService } from '../../../../../shared/domain/ports/unit-of-work.service';

export type Props = {
  userId: string;
  buffer: Buffer;
};

@Injectable()
export class CreateSignatureUseCase {
  constructor(
    private readonly signatureRepo: DoctorSignatureRepository,
    private readonly imageService: ImageService,
    private readonly unitOfWork: UnitOfWorkService,
  ) {}

  public async execute(data: Props): Promise<void> {
    let path: string | null = null;

    try {
      path = await this.imageService.save(data.buffer, 'signatures');

      await this.unitOfWork.execute(async () => {
        await this.signatureRepo.deactivateAll(data.userId);

        await this.signatureRepo.create({
          doctorId: data.userId,
          imageUrl: path!,
          isActive: true,
        });
      });
    } catch (error) {
      if (path) await this.imageService.delete(path);
      throw error;
    }
  }
}
