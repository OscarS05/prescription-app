# Prescription App

Technical test project built with:

- Node.js
- NestJS
- Next.js
- PostgreSQL
- Prisma
- Docker
- TypeScript
- React

## Monorepo Structure

```txt
apps/
  api/     # NestJS backend
  web/     # Next.js frontend

docs/
  decisions/
```

---

# Requirements

- Node.js >= 22
- npm >= 10
- Docker
- Docker Compose

---

# Installation

Install dependencies from the monorepo root:

```bash
npm install
```

---

# Environment Variables

Create:

```txt
apps/api/.env
```

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prescription_app?schema=public"
```

---

# Run PostgreSQL with Docker

From:

```txt
apps/api
```

Run:

```bash
docker compose up -d
```

This starts:

- PostgreSQL
- pgAdmin

---

# pgAdmin

URL:

```txt
http://localhost:5050
```

Credentials:

```txt
email: admin@admin.com
password: admin
```

PostgreSQL connection:

```txt
Host: postgres
Port: 5432
User: postgres
Password: postgres
Database: prescription_app
```

---

# Run Prisma Migrations

From:

```txt
apps/api
```

Run:

```bash
npx prisma migrate dev
```

---

# Run Seeds

From:

```txt
apps/api
```

Run:

```bash
npx prisma db seed
```

---

# Start Backend

From the repository root:

```bash
npm run dev:api
```

---

# Start Frontend

Coming soon.

---

# Demo Credentials

## Admin

```txt
email: admin@test.com
password: admin123
```

## Doctor

```txt
email: dr@test.com
password: dr123
```

## Patient

```txt
email: patient@test.com
password: patient123
```

---

# Technical Decisions

See:

```txt
docs/decisions/
```

---

# Architecture

The project is a monorepo with two applications:

- **`apps/api`** — NestJS REST API following Hexagonal architecture (domain / application / infrastructure layers).
- **`apps/web`** — Next.js frontend (in progress).
  Each application is independently runnable and has its own dependencies, configuration, and test suite. See the README inside each app for details.

---

# Backend Structure

See [`apps/api/README.md`](./apps/api/README.md) for the full backend documentation, including:

- Module breakdown
- Clean Architecture layer structure
- Authentication and RBAC
- API endpoints
- Test strategy

---

# Frontend Structure

Coming soon.

---

# Authentication

Cookie-based JWT authentication with access and refresh tokens. The API issues both tokens as HTTP-only cookies on login.

See [`apps/api/README.md`](./apps/api/README.md#authentication) for the full flow.

---

# Authorization (RBAC)

Three roles are defined: `ADMIN`, `DOCTOR`, and `PATIENT`. Access to endpoints is restricted per role via a `RolesGuard`.

See [`apps/api/README.md`](./apps/api/README.md#authorization-rbac) for details.

---

# API Endpoints

| Method | Path             | Description                 |
| ------ | ---------------- | --------------------------- |
| `POST` | `/auth/register` | Register a new user         |
| `POST` | `/auth/login`    | Login                       |
| `POST` | `/auth/logout`   | Logout                      |
| `POST` | `/auth/refresh`  | Refresh access token        |
| `GET`  | `/auth/me`       | Get current user            |
| `GET`  | `/users`         | List all users (Admin only) |

See [`apps/api/README.md`](./apps/api/README.md#api-endpoints) for the full endpoint reference.

---

# Testing

Tests are organized at three levels in `apps/api`:

| Level       | Command            | Description                                    |
| ----------- | ------------------ | ---------------------------------------------- |
| Unit        | `npm run test`     | Use cases and services in isolation            |
| Integration | `npm run test:int` | Repository and adapter tests against a real DB |
| E2E         | `npm run test:e2e` | Full HTTP flow tests                           |

Run from `apps/api`. See [`apps/api/README.md`](./apps/api/README.md#test-strategy) for details.

---

# Coverage

From `apps/api`:

```bash
npm run test:cov
```

---

# Deployment

Coming soon.

---

# Screenshots

Coming soon.
