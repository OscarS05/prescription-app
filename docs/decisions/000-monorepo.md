# 000 - Monorepo Architecture

## Context

The technical test requires developing both:

- Backend API (NestJS)
- Frontend application (Next.js)

Both applications belong to the same product and are tightly related.

## Decision

A monorepo architecture was chosen instead of using separate repositories.

Project structure:

```txt
apps/
  api/
  web/
```

## Rationale

Using a monorepo provides:

- Centralized project management
- Simpler development workflow
- Shared tooling and configuration
- Easier synchronization between frontend and backend
- Single source of documentation
- Easier reviewer onboarding

Since this is a relatively small MVP with a short delivery timeline,
a monorepo reduces operational overhead and accelerates development.

Deployments remain independent:

- Backend → Railway
- Frontend → Vercel

# Consequences

Advantages:

- Faster development setup
- Simpler repository management
- Better project cohesion

Tradeoff:

- Both applications share the same repository history
