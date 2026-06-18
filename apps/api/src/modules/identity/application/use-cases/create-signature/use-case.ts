import { Injectable } from '@nestjs/common';
import { DoctorSignatureRepository } from '../../../domain/ports/signature.repository';
import { ImageService } from '../../../../../shared/domain/ports/image.service';
import { UnitOfWorkService } from '../../../../../shared/domain/ports/unit-of-work.service';
import type { DoctorSignature } from '../../../domain/types/signatures.types';

export type Props = {
  userId: string;
  buffer: Buffer;
  filename: string;
};

@Injectable()
export class CreateSignatureUseCase {
  constructor(
    private readonly signatureRepo: DoctorSignatureRepository,
    private readonly imageService: ImageService,
    private readonly unitOfWork: UnitOfWorkService,
  ) {}

  public async execute(data: Props): Promise<DoctorSignature> {
    let path: string | null = null;

    try {
      path = await this.imageService.save(data.buffer, 'signatures', data.filename);

      return this.unitOfWork.execute(async () => {
        await this.signatureRepo.deactivateAll(data.userId);

        return this.signatureRepo.create({
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
