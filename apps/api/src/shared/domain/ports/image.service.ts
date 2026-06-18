import { ResourceFolder } from '../types/media.types';

export abstract class ImageService {
  abstract save(
    buffer: Buffer,
    folder: ResourceFolder,
    origFilename: string,
  ): Promise<string>;
  abstract delete(path: string): Promise<void>;
}
