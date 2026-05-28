export class PrescriptionNotFound extends Error {
  constructor(message?: string) {
    super(message || 'Prescription not found');
    this.name = 'PrescriptionNotFound';
  }
}

export class OnlyPatientsCanConsumePrescriptions extends Error {
  constructor(message?: string) {
    super(message || 'Only patients can mark a prescription as consumed');
    this.name = 'OnlyPatientsCanConsumePrescriptions';
  }
}

export class CannotDeleteConsumedPrescriptionError extends Error {
  constructor(message?: string) {
    super(message || 'A prescription cannot be deleted if its status is "consumed"');
    this.name = 'CannotDeleteConsumedPrescriptionError';
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

export class PrescriptionDoesNotBelongToDoctorError extends Error {
  constructor(message?: string) {
    super(message || 'Prescription does not belong to the doctor');
    this.name = 'PrescriptionDoesNotBelongToDoctorError';
  }
}

export class PrescriptionDoesNotBelongToPatientError extends Error {
  constructor(message?: string) {
    super(message || 'Prescription does not belong to the patient');
    this.name = 'PrescriptionDoesNotBelongToPatientError';
  }
}

export class PrescriptionHasAlreadyConsumed extends Error {
  constructor(message?: string) {
    super(message || 'Prescription has already consumed');
    this.name = 'PrescriptionHasAlreadyConsumed';
  }
}

export class DomainInternalError extends Error {
  constructor(message?: string) {
    super(message || 'Internal server error');
    this.name = 'DomainInternalError';
  }
}
