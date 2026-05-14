export class EmailAlreadyInUseError extends Error {
  constructor() {
    super('Email already in use');
    this.name = 'EmailAlreadyInUseError';
  }
}

export class InvalidSessionError extends Error {
  constructor() {
    super('Invalid session');
    this.name = 'InvalidSessionError';
  }
}

export class InvalidTokenError extends Error {
  constructor(message?: string) {
    super(message || 'Invalid token');
    this.name = 'InvalidTokenError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
    this.name = 'InvalidCredentialsError';
  }
}

export class DomainNotFoundError extends Error {
  constructor() {
    super('Resource not found');
    this.name = 'DomainNotFoundError';
  }
}
