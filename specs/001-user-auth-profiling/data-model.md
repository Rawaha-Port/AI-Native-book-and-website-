# Data Model: User and UserProfile

**Date**: 2025-12-15
**Feature**: [Better Auth with User Profiling](../spec.md)

This document defines the database schema for the entities required by this feature. The target database is Neon (PostgreSQL).

## Tables

### 1. `users`

Stores the core authentication information for a user.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the user. |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` | User's email address, used for login. |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | The hashed user password. |
| `better_auth_id`| `VARCHAR(255)` | `NULL`, `UNIQUE` | The user ID from the better-auth.com service. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of user creation. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of the last update. |

### 2. `user_profiles`

Stores the detailed software and hardware background for a user.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the profile record. |
| `user_id` | `UUID` | `NOT NULL`, `FOREIGN KEY (users.id)` | Links the profile to a user. |
| `languages` | `JSONB` | `NOT NULL` | Stores language skills as an array of objects, e.g., `[{"language": "Python", "level": "Intermediate"}]`. |
| `frameworks` | `JSONB` | `NOT NULL` | Stores framework knowledge as an array of strings or objects. |
| `experience_years` | `VARCHAR(50)` | `NULL` | Stores years of experience, can be a range like "3-5". |
| `devices` | `JSONB` | `NULL` | Stores devices used, as an array of strings or objects. |
| `architecture_familiarity` | `JSONB` | `NULL` | Stores familiarity with architectures, as an array of strings or objects. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of profile creation. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of the last update. |

## Relationships

- A `users` record has a **one-to-one** relationship with a `user_profiles` record.
- The `user_profiles.user_id` is a foreign key that references `users.id`.
