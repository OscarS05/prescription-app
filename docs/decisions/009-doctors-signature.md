# Doctor Signature History

## Context

Prescriptions may include a doctor's signature in the generated PDF. The system must preserve the signature used when a prescription was created while allowing doctors to create new signatures over time.

## Decision

A `DoctorSignature` entity will be implemented to store signature history.

Each prescription will store a reference to the signature used at creation time through `doctorSignatureId`.

Doctors may create new signatures, but existing signatures cannot be modified or deleted. Only one signature can be active at a time.

## Alternatives Considered

### Store the signature image in every prescription

This approach guarantees complete independence from the signature source but duplicates data and increases storage usage.

### Store only the current signature on the doctor profile

This approach is simpler but does not preserve historical accuracy when a doctor changes their signature.

## Consequences

- Signature history is preserved.
- Prescriptions always display the signature used at creation time.
- Signature records become immutable audit artifacts.
- Storage usage is reduced because signatures can be shared across multiple prescriptions.
- Additional logic is required to manage the active signature.
