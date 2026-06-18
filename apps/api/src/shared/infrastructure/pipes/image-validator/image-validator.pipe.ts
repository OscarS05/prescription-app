import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  private readonly maxSizeInBytes = 30 * 1024 * 1024; // 30MB

  transform(file: Express.Multer.File | undefined): Express.Multer.File | undefined {
    if (!file) return file;

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image type. Allowed: jpg, jpeg, png, webp');
    }

    if (file.size > this.maxSizeInBytes) {
      throw new BadRequestException('Image size exceeds 30MB limit');
    }

    return file;
  }
}
