import { promises as fs } from 'node:fs';
import path from 'node:path';

import { ImageServiceLocalAdapter } from '../../../src/shared/infrastructure/services/image.service';

describe('ImageServiceLocalAdapter Integration', () => {
  let service: ImageServiceLocalAdapter;

  beforeEach(() => {
    service = new ImageServiceLocalAdapter();
  });

  afterAll(async () => {
    const uploadsDir = path.join(process.cwd(), 'uploads');

    await fs.rm(uploadsDir, {
      recursive: true,
      force: true,
    });
  });

  describe('save()', () => {
    it('should save an image successfully', async () => {
      const buffer = Buffer.from('fake-image-content');

      const imagePath = await service.save(buffer, 'signatures', 'signature.png');

      expect(imagePath).toMatch(/^\/uploads\/signatures\/.*\.png$/);

      const absolutePath = path.join(process.cwd(), imagePath.replace(/^\/+/, ''));

      const exists = await fs
        .access(absolutePath)
        .then(() => true)
        .catch(() => false);

      expect(exists).toBe(true);
    });
  });

  describe('delete()', () => {
    it('should delete an image successfully', async () => {
      const buffer = Buffer.from('fake-image-content');

      const imagePath = await service.save(buffer, 'signatures', 'signature.png');

      const absolutePath = path.join(process.cwd(), imagePath.replace(/^\/+/, ''));

      await service.delete(imagePath);

      const exists = await fs
        .access(absolutePath)
        .then(() => true)
        .catch(() => false);

      expect(exists).toBe(false);
    });

    it('should fail if image does not exist', async () => {
      await expect(service.delete('/uploads/signatures/not-found.png')).rejects.toThrow();
    });
  });
});
