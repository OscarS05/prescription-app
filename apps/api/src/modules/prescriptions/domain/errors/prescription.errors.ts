export class PrescriptionNotFound extends Error {
  constructor(message?: string) {
    super(message || 'Prescription not found');
    this.name = 'PrescriptionNotFound';
  }
}
