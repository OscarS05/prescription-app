## 008-prescription-update-and-status-endpoints

## Context

The technical test suggested an action-oriented endpoint similar to:

```txt
PUT /prescriptions/:id/consume
```

to allow patients to mark prescriptions as consumed.

During the API design process, the prescription workflow and endpoint semantics were reviewed.

Additionally, the original test did not include endpoints for doctors to update or delete prescriptions after creation.

## Decision

The action-oriented endpoint was replaced with resource-oriented endpoints using partial updates.

Final endpoints:

```txt
PATCH /prescriptions/:id
PATCH /prescriptions/:id/status
```

Responsibilities:

- `PATCH /prescriptions/:id`
  - Used by doctors to update prescription information.

- `PATCH /prescriptions/:id/status`
  - Used by patients to update prescription status.

A future endpoint was also planned:

```txt
DELETE /prescriptions/:id
```

to allow doctors to delete prescriptions.

# Rationale

Using `PATCH` better represents partial resource updates and avoids action-based URL naming such as `/consume`.

Separating prescription updates from status updates improves clarity, authorization boundaries, and endpoint semantics.

Adding update and delete capabilities for doctors provides a more realistic prescription management workflow beyond the original technical test requirements.

## Tradeoff

This approach introduces more endpoints compared to a single generic update action.

It also requires role-based authorization rules to clearly define which actors can modify prescription content or status.
