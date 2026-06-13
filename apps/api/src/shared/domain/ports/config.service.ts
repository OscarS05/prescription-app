export abstract class ConfigService {
  abstract get<T>(key: string): T;
}
