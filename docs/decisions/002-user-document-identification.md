# 002 - User Document Identification

## Context

The original technical test only requires user authentication through email and password.

However, in real healthcare environments, identifying users exclusively by email may not provide a reliable long-term identification mechanism because:

- Email addresses can change over time
- Users may forget which email they registered with
- Different users may share similar names
- Medical and prescription workflows commonly rely on official identification documents

## Decision

Two additional fields were added to the `users` table:

- `document_type`
- `document_number`

The combination of both fields is unique per user.

Example:

```sql
document_type ENUM('cc', 'ti', 'passport') NOT NULL,
document_number VARCHAR(20) NOT NULL,

UNIQUE KEY unique_document (document_type, document_number)
```
