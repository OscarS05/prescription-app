export class PrescriptionItemNotFound extends Error {
  constructor(message?: string) {
    super(message || 'Prescription item not found');
    this.name = 'PrescriptionItemNotFound';
  }
}

export class PrescriptionItemIdDoesNotMatchError extends Error {
  constructor(message?: string) {
    super(message || 'Prescription item id does not match with the provided');
    this.name = 'PrescriptionItemIdDoesNotMatchError';
  }
}

export class PrescriptionItemConflictError extends Error {
  constructor(message?: string) {
    super(message || 'Invalid update of prescription items');
    this.name = 'PrescriptionItemConflictError';
  }
}
