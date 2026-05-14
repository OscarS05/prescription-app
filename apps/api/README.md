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

Create:

```txt
.env
```

Example:

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

---

## Run Migrations

```bash
npx prisma migrate dev
```

---

## Reset Database

```bash
npx prisma migrate reset
```

---

## Run Seeds

```bash
npx prisma db seed
```

---

# Development

## Start API

```bash
npm run start:dev
```

---

## Build

```bash
npm run build
```

---

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

---

## Watch Tests

```bash
npm run test:watch
```

---

## Coverage

```bash
npm run test:cov
```

---

## Integration Tests

```bash
npm run test:integration
```

---

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

Coming soon.

---

# Architecture

Coming soon.

---

# Authentication

Coming soon.

---

# Authorization (RBAC)

Coming soon.

---

# Error Handling

Coming soon.

---

# Validation

Coming soon.

---

# API Endpoints

Coming soon.

---

# Test Strategy

Coming soon.
