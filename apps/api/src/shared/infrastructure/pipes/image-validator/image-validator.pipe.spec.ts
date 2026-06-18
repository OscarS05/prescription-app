import { BadRequestException } from '@nestjs/common';
import { ImageValidationPipe } from './image-validator.pipe';

describe('ImageValidationPipe', () => {
  let pipe: ImageValidationPipe;

  beforeEach(() => {
    pipe = new ImageValidationPipe();
  });

  describe('Successful cases', () => {
    it('should return undefined when file is not provided', () => {
      const result = pipe.transform(undefined);

      expect(result).toBeUndefined();
    });

    it('should accept jpeg images', () => {
      const file = {
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const result = pipe.transform(file);

      expect(result).toBe(file);
    });

    it('should accept png images', () => {
      const file = {
        mimetype: 'image/png',
        size: 1024,
      } as Express.Multer.File;

      const result = pipe.transform(file);

      expect(result).toBe(file);
    });

    it('should accept webp images', () => {
      const file = {
        mimetype: 'image/webp',
        size: 1024,
      } as Express.Multer.File;

      const result = pipe.transform(file);

      expect(result).toBe(file);
    });

    it('should accept images with exactly 30MB', () => {
      const file = {
        mimetype: 'image/png',
        size: 30 * 1024 * 1024,
      } as Express.Multer.File;

      const result = pipe.transform(file);

      expect(result).toBe(file);
    });
  });

  describe('Failed cases', () => {
    it('should not accept jpg images', () => {
      const file = {
        mimetype: 'image/jpg',
        size: 1024,
      } as Express.Multer.File;

      expect(() => pipe.transform(file)).toThrow(BadRequestException);

      expect(() => pipe.transform(file)).toThrow(
        'Invalid image type. Allowed: jpg, jpeg, png, webp',
      );
    });

    it('should reject invalid mime type', () => {
      const file = {
        mimetype: 'application/pdf',
        size: 1024,
      } as Express.Multer.File;

      expect(() => pipe.transform(file)).toThrow(BadRequestException);

      expect(() => pipe.transform(file)).toThrow(
        'Invalid image type. Allowed: jpg, jpeg, png, webp',
      );
    });

    it('should reject images larger than 30MB', () => {
      const file = {
        mimetype: 'image/png',
        size: 30 * 1024 * 1024 + 1,
      } as Express.Multer.File;

      expect(() => pipe.transform(file)).toThrow(BadRequestException);

      expect(() => pipe.transform(file)).toThrow('Image size exceeds 30MB limit');
    });
  });
});
