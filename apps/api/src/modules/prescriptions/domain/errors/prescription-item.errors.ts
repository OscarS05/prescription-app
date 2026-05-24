export class PrescriptionItemNotFound extends Error {
  constructor(message?: string) {
    super(message || 'Prescription item not found');
    this.name = 'PrescriptionItemNotFound';
  }
}
