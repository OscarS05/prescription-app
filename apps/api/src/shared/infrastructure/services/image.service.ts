import { Injectable, Logger } from '@nestjs/common';
import { ImageService } from '../../domain/ports/image.service';
import { ResourceFolder } from '../../domain/types/media.types';
import path from 'node:path';
import { promises as fs } from 'node:fs';

@Injectable()
export class ImageServiceLocalAdapter extends ImageService {
  private readonly UPLOAD_FOLDER = 'uploads';
  private readonly uploadDir = path.join(process.cwd(), this.UPLOAD_FOLDER);
  private readonly logger = new Logger(ImageServiceLocalAdapter.name);

  async save(buffer: Buffer, folder: ResourceFolder, origFilename: string): Promise<string> {
    await this.ensureUploadDirExists(folder);
    const filename = this.generateFilename(origFilename);
    const filePath = path.join(this.uploadDir, folder, filename);

    await fs.writeFile(filePath, buffer);

    return `/${this.UPLOAD_FOLDER}/${folder}/${filename}`;
  }

  async delete(filePath: string): Promise<void> {
    try {
      const normalizedPath = path.join(process.cwd(), filePath.replace(/^\/+/, ''));

      await fs.unlink(normalizedPath);
    } catch (error) {
      this.logger.error(`Failed to delete image at path: ${filePath}`, error);
      throw error;
    }
  }

  private async ensureUploadDirExists(folder: ResourceFolder): Promise<void> {
    await fs.mkdir(path.join(this.uploadDir, folder), { recursive: true });
  }

  private generateFilename(original: string): string {
    const ext = path.extname(original).toLowerCase();
    return `${crypto.randomUUID()}${ext}`;
  }
}
