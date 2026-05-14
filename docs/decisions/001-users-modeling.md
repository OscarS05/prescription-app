# 001 - Doctors and Patients Primary Keys

## Context

The technical test suggests separate tables for doctors and patients,
each with its own primary key plus a foreign key referencing users.

## Decision

Instead of using independent IDs, the `user_id` foreign key is also
used as the primary key in both tables.

Example:

- doctors.user_id -> PK + FK(users.id)
- patients.user_id -> PK + FK(users.id)

## Rationale

This models the relationship as true 1:1 since:

- A doctor belongs to exactly one user
- A patient belongs to exactly one user

Using separate IDs would add unnecessary redundancy.

## Consequences

Advantages:

- Simpler schema
- Stronger relational integrity
- Less redundant identifiers

Tradeoff:

- Slightly less flexibility if profiles were later decoupled from users
