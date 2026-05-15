# 006 - Authentication Token Delivery Strategy

## Context

The technical test suggests returning access and refresh tokens directly
in the `/auth/login` response body.

However, the application implements cookie-based authentication for
improved security.

## Decision

Authentication tokens are stored and delivered using HTTP-only cookies
instead of being exposed in the JSON response body.

The login endpoint returns only the authenticated user information.

Example:

```json
{
  "user": {}
}
```

# Rationale

Using HTTP-only cookies provides better protection against:

- XSS attacks
- Client-side token exposure
- Accidental token leakage

# Additionally:

HTTP status codes already communicate operation success
Explicit success messages were considered redundant for this API design

## Tradeoff

This approach differs slightly from the original technical specification,
but was intentionally chosen to follow more secure and production-oriented
authentication practices.
