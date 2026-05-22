# Prescription App API

Backend service built with:

- Node.js
- NestJS
- TypeScript
- Prisma
- PostgreSQL

---

# Requirements

- Node.js >= 22
- npm >= 10
- Docker
- Docker Compose

---

# Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prescription_app?schema=public"
```

---

# Run PostgreSQL

```bash
docker compose up -d
```

---

# Prisma

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Migrations

```bash
npx prisma migrate dev
```

## Reset Database

```bash
npx prisma migrate reset
```

## Run Seeds

```bash
npx prisma db seed
```

### Database Scripts (via npm)

| Script            | Command                        | Description                  |
| ----------------- | ------------------------------ | ---------------------------- |
| `db:local:seed`   | `prisma db seed`               | Seed local database          |
| `db:dev:migrate`  | `prisma migrate dev`           | Run dev migrations           |
| `db:test:migrate` | `prisma migrate deploy`        | Deploy migrations on test DB |
| `db:test:reset`   | `prisma migrate reset --force` | Reset test database          |
| `db:test:seed`    | `prisma db seed`               | Seed test database           |

---

# Development

## Start API

```bash
npm run start:dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm run start:prod
```

---

# Testing

## Unit Tests

```bash
npm run test
```

## Watch Tests

```bash
npm run test:watch
```

## Coverage

```bash
npm run test:cov
```

## Integration Tests

```bash
npm run test:int
```

## E2E Tests

```bash
npm run test:e2e
```

---

# Lint

```bash
npm run lint
```

---

# Formatting

```bash
npm run format
```

---

# Modules

The application is organized into the following feature modules:

| Module          | Path                        | Description                                           |
| --------------- | --------------------------- | ----------------------------------------------------- |
| `identity`      | `src/modules/identity`      | Authentication, session management, and user identity |
| `prescriptions` | `src/modules/prescriptions` | Prescription management                               |

---

# Architecture

The project follows **Clean Architecture** principles, with each module divided into three layers:

```
modules/
└── <module>/
    ├── application/        # Use cases and application services
    │   ├── services/       # Orchestration services (e.g. SessionManager)
    │   └── use-cases/      # One folder per use case
    ├── domain/             # Business logic — no framework dependencies
    │   ├── enums/          # Domain enumerations
    │   ├── errors/         # Domain-specific errors
    │   ├── ports/          # Interfaces / abstractions (repositories, services)
    │   └── types/          # Domain types and value objects
    └── infrastructure/     # NestJS adapters: controllers, DB, services
        ├── controllers/    # HTTP controllers
        ├── db/             # Prisma repository implementations
        ├── decorators/     # Custom NestJS decorators
        ├── dtos/           # Request/response DTOs
        ├── helpers/        # Infrastructure utilities
        ├── mappers/        # Domain ↔ DTO / DB entity mappers
        └── services/       # Infrastructure service implementations
```

### Shared Infrastructure

Cross-cutting concerns live in `src/shared/`:

```
shared/
├── domain/                 # Shared domain primitives
└── infrastructure/
    ├── decorators/         # @CurrentUser, @Public, @Roles
    ├── env/                # Environment variable validation and access
    ├── guards/             # AccessToken, RefreshToken, Roles guards
    └── prisma/             # PrismaModule and PrismaService
```

---

# Authentication

Authentication is session-based using **JWT access and refresh tokens** delivered via HTTP-only cookies.

### Flow

1. **Create users** — `POST /admin/users` — creates a new user account FROM ADMIN PANEL. This was misnamed, it should be called POST /users.
2. **Login** — `POST /auth/login` — validates credentials, issues an access token (short-lived) and a refresh token (long-lived) as cookies.
3. **Refresh** — `POST /auth/refresh` — uses the refresh token cookie to issue a new access token.
4. **Logout** — `DELETE /auth/session` — invalidates the refresh token and clears cookies.
5. **Get current user** — `GET /users` — returns a list of users from admin panel.

### Tokens

| Token         | Transport        | Purpose                  |
| ------------- | ---------------- | ------------------------ |
| Access Token  | HTTP-only cookie | Authenticates requests   |
| Refresh Token | HTTP-only cookie | Issues new access tokens |

Refresh token hashes are stored in the database and validated on every refresh. Logout clears the hash, invalidating the token server-side.

### Decorators

| Decorator         | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `@Public()`       | Skips access token guard on a route                    |
| `@CurrentUser()`  | Injects the authenticated user into a controller param |
| `@AccessToken()`  | Extracts the raw access token from the cookie          |
| `@RefreshToken()` | Extracts the raw refresh token from the cookie         |

---

# Authorization (RBAC)

The API uses **Role-Based Access Control** enforced via the `RolesGuard`.

### Roles

Defined in `src/modules/identity/domain/enums/roles.enum.ts`:

| Role      | Description                         |
| --------- | ----------------------------------- |
| `ADMIN`   | Full access to all resources        |
| `DOCTOR`  | Can create and manage prescriptions |
| `PATIENT` | Can view their own prescriptions    |

### Usage

Decorate any controller or route handler with `@Roles(...)` to restrict access:

```ts
@Roles(Role.ADMIN, Role.DOCTOR)
@Get('users')
getUsers() { ... }
```

Routes decorated with `@Public()` bypass both authentication and role checks.

---

# Error Handling

Domain errors are defined per module under `domain/errors/` and mapped to HTTP responses by `error.mapper.ts` in each module's infrastructure layer.

### Example domain errors (`identity` module)

| Error                     | HTTP Status | Description              |
| ------------------------- | ----------- | ------------------------ |
| `UserNotFoundError`       | 404         | User does not exist      |
| `InvalidCredentialsError` | 401         | Wrong email or password  |
| `UserAlreadyExistsError`  | 409         | Email already registered |
| `UnauthorizedError`       | 401         | Token missing or invalid |

Errors are never exposed as raw exceptions. Each use case throws a typed domain error; the mapper converts it to the appropriate NestJS `HttpException`.

---

# Validation

Request validation is handled by **class-validator** and **class-transformer** through NestJS's global `ValidationPipe`.

DTOs are defined per module under `infrastructure/dtos/`. Incoming payloads are automatically validated and transformed before reaching use cases.

### Example DTOs (`identity` module)

| DTO               | Used in               |
| ----------------- | --------------------- |
| `LoginDto`        | `POST /auth/login`    |
| `RegisterUserDto` | `POST /auth/register` |
| `UserDto`         | User responses        |
| `DoctorDto`       | Doctor profile data   |
| `PatientDto`      | Patient profile data  |

---

# API Overview

## Docs

Complete API documentation is available through Swagger:

```txt
/api/docs
```

## Auth

```txt
POST   /auth/login
POST   /auth/refresh
DELETE /auth/session
```

## Me

```txt
GET /me/profile
GET /me/prescriptions
```

## Admin

```txt
POST /admin/users
GET  /admin/users
GET  /admin/prescriptions
GET  /admin/metrics
```

## Prescriptions

```txt
POST  /prescriptions
GET   /prescriptions/:id
PATCH /prescriptions/:id
```

---

# Test Strategy

The test suite is organized into three levels:

### Unit Tests (`src/**/*.spec.ts`)

- Colocated with source files.
- Cover use cases and application services in isolation.
- Dependencies (repositories, services) are fully mocked.
- Run with: `npm run test`

### Integration Tests (`test/integration/`)

- Test infrastructure adapters against a real test database.
- Cover repository implementations and service adapters (e.g. hasher, token service).
- Require a running PostgreSQL instance configured for `NODE_ENV=test`.
- Run with: `npm run test:int`

### E2E Tests (`test/e2e/`)

- Spin up the full NestJS application.
- Cover authentication flows (`auth.e2e-spec.ts`) and user endpoints (`user.e2e-spec.ts`).
- Run sequentially (`--runInBand`) to avoid state conflicts.
- Run with: `npm run test:e2e`

### Coverage

```bash
npm run test:cov
```
