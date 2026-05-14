# 005 - Refresh Token Persistence Strategy

## Context

The application requires JWT authentication using:

- Access tokens
- Refresh tokens

The MVP needs safe token rotation, and I think adding token invalidation and logout would be helpful.

## Decision

A `refresh_token_hash` field was added directly to the `users` table.

The refresh token is:

- Hashed before persistence
- Rotated during refresh operations
- Invalidated during logout

## Rationale

This approach allows:

- Secure refresh token rotation
- Session invalidation
- Logout implementation
- Simpler authentication flow for the MVP

The solution intentionally avoids additional infrastructure and complexity.

## Tradeoff

For simplicity, refresh token persistence was implemented directly in
the `users` table instead of introducing:

- Dedicated sessions tables
- Token blacklists
- Distributed session stores
- Redis-based session management

In a production-scale system, these alternatives could provide better
multi-device support and distributed session control.
