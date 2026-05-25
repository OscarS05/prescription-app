export class PrescriptionNotFound extends Error {
  constructor(message?: string) {
    super(message || 'Prescription not found');
    this.name = 'PrescriptionNotFound';
  }
}

export class PrescriptionCodeError extends Error {
  constructor(message?: string) {
    super(message || 'Prescription code is already in use');
    this.name = 'PrescriptionCodeError';
  }
}

export class DomainInternalError extends Error {
  constructor(message?: string) {
    super(message || 'Internal server error');
    this.name = 'DomainInternalError';
  }
}
