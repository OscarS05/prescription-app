# 003 - Soft Delete Strategy

## Context

The system requires preserving historical information for important entities
such as users and prescriptions.

Physical deletion could cause:

- Loss of auditability
- Broken historical references
- Inconsistent medical records

Additionally, some fields such as email and prescription codes must remain
unique only for active records.

## Decision

Soft delete was implemented using a nullable `deleted_at` column.

Example:

```sql
deleted_at TIMESTAMP NULL
```

Instead of physically deleting records, entities are marked as deleted by
setting a timestamp.

Soft delete was only added to:

- users
- prescriptions

Child entities rely on their parent lifecycle and do not implement
independent soft delete behavior.

## PostgreSQL Partial Unique Indexes

To preserve uniqueness only for active records, PostgreSQL partial unique
indexes were used.

Example:

```sql
CREATE UNIQUE INDEX users_email_unique
ON users(email)
WHERE deleted_at IS NULL;
```

This allows:

- Reusing emails after soft deletion
- Reusing prescription codes after soft deletion
- Preserving historical records without violating uniqueness

## Rationale

This approach provides:

- Better auditability
- Safer deletion behavior
- Realistic persistence modeling
- Compatibility with historical medical data

Using PostgreSQL partial indexes avoids workarounds commonly required in
other relational databases.

## Consequences

Advantages:

- Historical records remain available
- Uniqueness only applies to active entities
- Cleaner soft delete implementation

Tradeoff:

- Queries must explicitly filter deleted records
- Additional indexing strategy is required
