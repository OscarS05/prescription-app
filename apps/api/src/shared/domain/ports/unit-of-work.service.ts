export abstract class UnitOfWorkService {
  abstract execute<T>(work: () => Promise<T>): Promise<T>;
}
