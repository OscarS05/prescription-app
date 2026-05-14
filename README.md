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

Coming soon.

---

# Backend Structure

Coming soon.

---

# Frontend Structure

Coming soon.

---

# Authentication

Coming soon.

---

# Authorization (RBAC)

Coming soon.

---

# API Endpoints

Coming soon.

---

# Testing

Coming soon.

---

# Coverage

Coming soon.

---

# Deployment

Coming soon.

---

# Screenshots

Coming soon.
