# 004 - Backend Modular Architecture

## Context

The application includes multiple business domains with different responsibilities:

- Authentication and authorization
- User management
- Prescription management

The project also needs to remain maintainable and extensible while keeping
development speed appropriate for a technical test MVP.

## Decision

The backend was organized using a modular architecture inspired by DDD and
Hexagonal Architecture principles.

Modules:

```txt
auth/
users/
prescriptions/
  application/
  domain/
  infrastructure/
  presentation/
```

# Rationale

This structure provides:

- Clear separation of responsibilities
- Better maintainability
- Easier scalability
- Isolated business logic
- Reduced coupling between modules

The architecture intentionally avoids excessive abstraction in order to
maintain development speed and simplicity for the MVP scope.

# Module Responsibilities

## auth

Handles:

- Authentication
- JWT
- Password hashing
- Authorization helpers and guards

## users

Handles:

- Users
- Doctors
- Patients

Doctors and patients are grouped inside the same module because their
lifecycle depends directly on users.

## prescriptions

Handles:

- Prescriptions
- Prescription items

Prescription items are treated as part of the same domain lifecycle.

# Consequences

Advantages:

- Better code organization
- Portability
- Clear domain boundaries
- Easier future growth

Tradeoff:

- Slightly more boilerplate compared to a simple CRUD structure
