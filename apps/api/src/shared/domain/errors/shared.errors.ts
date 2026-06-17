export class DomainInternalServerError extends Error {
  constructor(message?: string) {
    super(message || 'Something went wrong');
    this.name = 'DomainInternalServerError';
  }
}
