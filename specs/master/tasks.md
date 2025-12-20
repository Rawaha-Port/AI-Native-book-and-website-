# Tasks for Integrating Drizzle ORM with Better Auth for Persistent User Storage

**Feature**: Integrate Drizzle ORM with Better Auth for persistent user storage
**Branch**: `master`
**Plan**: `specs/master/plan.md`
**User Stories**:
- [US1] As a user, I want the authentication service to store my user data persistently so that my login information is not lost when the service restarts.

---

## Phase 1: Setup - Drizzle ORM and Better Auth Dependencies

- [X] T001 Install core Drizzle ORM, PostgreSQL driver, Better Auth: `npm install drizzle-orm postgres better-auth` in `chatbot-backend/better_auth_service/`
- [X] T002 Install development dependencies for Drizzle Kit and Better Auth CLI: `npm install -D drizzle-kit` in `chatbot-backend/better_auth_service/`
- [X] T003 Ensure `NEON_DATABASE_URL` and `BETTER_AUTH_SECRET` are configured in `chatbot-backend/.env` (already done by user).

## Phase 2: Foundational - Drizzle ORM Configuration

- [X] T004 Create `drizzle.config.ts` in `chatbot-backend/better_auth_service/` with the configuration as specified in `specs/master/quickstart.md`.
- [X] T005 Create `db/` directory in `chatbot-backend/better_auth_service/`.
- [X] T006 Create `db/index.ts` in `chatbot-backend/better_auth_service/db/` for Drizzle connection as specified in `specs/master/quickstart.md`.
- [X] T007 Create empty `db/schema.ts` in `chatbot-backend/better_auth_service/db/`.

## Phase 3: User Story 1 - Persistent User Storage

- [ ] T008 [US1] Update `chatbot-backend/better_auth_service/src/index.ts` to import `drizzleAdapter` and `db` instance:
    ```typescript
    // Add new imports
    import { drizzleAdapter } from '@better-auth/drizzle-adapter';
    import { db } from './db';
    // Remove the MemoryAdapter import
    ```
- [X] T009 [US1] Create `chatbot-backend/better_auth_service/config/auth.ts` with the `betterAuth` configuration.
    ```typescript
    // chatbot-backend/better_auth_service/config/auth.ts
    import { betterAuth } from 'better-auth';
    import { username } from 'better-auth/plugins/username';
    import { drizzleAdapter } from '@better-auth/drizzle-adapter';
    import { db } from '../db'; // Adjust path as needed

    export const auth = betterAuth({
      secret: process.env.BETTER_AUTH_SECRET,
      plugins: [
        username({
          // You can add options here if needed, e.g., password complexity
        }),
      ],
      database: drizzleAdapter(db, { provider: 'pg' }), // Configure Drizzle adapter
      // ... other configurations
    });
    ```
- [X] T009.1 [US1] Modify `chatbot-backend/better_auth_service/src/index.ts` to import `auth` from `config/auth.ts` and remove its local configuration.
    ```typescript
    // chatbot-backend/better_auth_service/src/index.ts (excerpt)
    import { auth } from './config/auth'; // New import for auth configuration

    // ... (rest of index.ts)
    // Remove the local betterAuth configuration block
    ```
- [X] T010 [US1] Generate `better-auth` specific schema into `chatbot-backend/better_auth_service/db/schema.ts`: `npx @better-auth/cli@latest generate --config=./config/auth.ts` in `chatbot-backend/better_auth_service/`
- [ ] T011 [US1] Generate Drizzle migration files based on the updated schema: `npx drizzle-kit generate` in `chatbot-backend/better_auth_service/`
- [X] T011.1 Install `dotenv-cli` as a development dependency: `npm install -D dotenv-cli` in `chatbot-backend/better_auth_service/`
- [X] T012 [US1] Apply the generated migrations to the Neon DB: `npx dotenv -e ../.env drizzle-kit migrate` in `chatbot-backend/better_auth_service/`

## Phase 4: Polish & Cross-Cutting Concerns

- [ ] T013 [P] Implement unit and integration tests for `better_auth_service` using Jest in `chatbot-backend/better_auth_service/tests/`.
- [ ] T014 [P] Update `chatbot-backend/better_auth_service/package.json` with a `start` script (e.g., `ts-node src/index.ts`) for easier execution.
- [ ] T015 Update documentation (e.g., `README.md` for `chatbot-backend/better_auth_service/`) to reflect Drizzle integration and setup steps.
- [ ] T016 Verify signup/signin functionality with persistent storage.

---

### Dependency Graph (Story Completion Order)

- [US1] can only start after Phase 2 is complete.

### Parallel Execution Examples

- T001, T002 (installations) can be run sequentially or in parallel if package manager allows.
- T013 (tests) can be developed in parallel with T008-T012 once the Drizzle setup is complete.
- T014 (start script) and T015 (documentation) can be done in parallel.

### Suggested MVP Scope

The MVP for this feature is to successfully complete **Phase 1, Phase 2, and Phase 3**. This will achieve the core persistent user storage for the authentication service.

### Independent Test Criteria for [US1]

- User is able to sign up successfully via the frontend.
- User is able to sign in successfully via the frontend after a successful signup.
- After restarting the `better_auth_service` and the FastAPI backend, the user can still sign in with previously registered credentials.
- New users registered after service restart are also able to sign in.
- The Neon DB (PostgreSQL) contains the user, account, and session data managed by `better-auth`.
