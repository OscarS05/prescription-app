type ResourceFolder = 'signatures';

export abstract class ImageService {
  abstract save(buffer: Buffer, folder: ResourceFolder): Promise<string>;
  abstract delete(path: string): Promise<void>;
}
