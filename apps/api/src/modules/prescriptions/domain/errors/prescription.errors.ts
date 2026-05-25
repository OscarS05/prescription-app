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

export class DoctorIdDoesNotBelongError extends Error {
  constructor(message?: string) {
    super(message || 'Prescription ID does not belong to the doctor');
    this.name = 'DoctorIdDoesNotBelongError';
  }
}

export class DomainInternalError extends Error {
  constructor(message?: string) {
    super(message || 'Internal server error');
    this.name = 'DomainInternalError';
  }
}
