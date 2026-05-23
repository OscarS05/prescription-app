## 007-api-route-organization

## Context

The initial technical test suggested endpoints such as:

```txt
GET /auth/profile
GET /prescriptions?mine=true
GET /patients
GET /doctors
```

During the implementation process, the API structure and domain relationships were reviewed.

The system does not contain a direct relationship between doctors and patients. Both entities are only related through prescriptions.

Additionally, some endpoints were originally grouped under generic namespaces such as:

```txt
/users
```

even though they were only accessible by administrators.

## Decision

The API was reorganized using context-based namespaces.

Authenticated user operations were grouped under:

```txt
/me
```

Administrative operations were grouped under:

```txt
/admin
```

Final structure:

```txt
GET    /me/profile
GET    /me/prescriptions

GET    /admin/users
GET    /admin/prescriptions
```

The following endpoints were intentionally NOT implemented:

```txt
GET /patients
GET /doctors
```

because the domain does not model a direct doctor-patient relationship.

Administrative filtering is handled through:

```txt
GET /admin/users?role=doctor
GET /admin/users?role=patient
```

The endpoint:

```txt
GET /prescriptions?mine=true
```

was also discarded in favor of explicit contextual endpoints.

# Rationale

Using `/me` provides clearer semantics for resources associated with the authenticated user and avoids implicit behavior based on query parameters or roles.

Using `/admin` explicitly communicates administrative scope and permissions.

Avoiding `/patients` and `/doctors` prevented introducing artificial relationships or redundant endpoints that were not supported by the domain model.

This organization improved:

- API clarity
- semantic consistency
- RBAC alignment
- endpoint discoverability
- future scalability

## Tradeoff

Additionally, `/me/prescriptions` requires internal role-aware behavior to determine which prescriptions are visible to the authenticated user.
