export class DomainInternalServerError extends Error {
  constructor(message?: string) {
    super(message || 'Something went wrong');
    this.name = 'DomainInternalServerError';
  }
}

export class BadRequestError extends Error {
  constructor(message?: string | null) {
    super(message || 'Internal server error');
    this.name = 'BadRequestError';
  }
}
