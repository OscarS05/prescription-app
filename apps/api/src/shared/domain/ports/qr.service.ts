export abstract class QrService {
  abstract generate(value: string): Promise<string>;
}
