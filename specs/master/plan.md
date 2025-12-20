# Implementation Plan: Integrate Drizzle ORM with Better Auth for persistent user storage

**Branch**: `master` | **Date**: 2025-12-20 | **Spec**: (Not formally defined for this change)
**Input**: User request to integrate Drizzle ORM with Better Auth for persistent user storage.

## Summary

Replace the problematic in-memory database of the Node.js `better_auth_service` with a persistent solution using Drizzle ORM and Neon DB (PostgreSQL). This will ensure user data is retained across restarts and fix current authentication failures, enabling a fully functional authentication flow for the frontend.

## Technical Context

**Language/Version**: TypeScript (Node.js backend), Python 3.11 (FastAPI backend)
**Primary Dependencies**: `better-auth`, `drizzle-orm`, `postgres` (for Node.js); `fastapi`, `sqlalchemy` (for Python)
**Storage**: Neon DB (PostgreSQL)
**Testing**: Jest for Node.js `better_auth_service` (unit and integration tests).
**Target Platform**: Linux/Windows server (Node.js/Python)
**Project Type**: Web (frontend + backend)
**Performance Goals**: Authentication operations (signin/signup) should aim for a p95 latency of under 200ms.
**Constraints**: Must integrate with existing FastAPI backend, existing Neon DB schema for users (specifically, the `User` table for `better_auth_id`).
**Scale/Scope**: Single application for book website users.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Content First**: This plan ensures core functionality for user management, indirectly supporting content accessibility and personalization.
- [x] **Docusaurus for Structure**: N/A (Backend change, no direct Docusaurus impact)
- [x] **Markdown as the Source**: N/A (Backend change, no direct Markdown content impact)
- [x] **Living Document**: Improves maintainability and robustness of the authentication system, supporting continuous improvement.
- [x] **Automated Checks**: This plan explicitly includes tasks for adding tests (unit/integration) for the Node.js `better_auth_service`, adhering to this principle.
- [x] **Clear and Concise Language**: N/A (Backend change, no direct language impact)

## Project Structure

### Documentation (this feature)

```text
specs/master/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/
```

**Structure Decision**: The project already follows a web application structure with separate `chatbot-backend` and `my-book-website` directories. The changes will primarily be within `chatbot-backend/better_auth_service` and its interaction with the `chatbot-backend`'s Python services and database.
New Drizzle ORM related files will be created under `chatbot-backend/better_auth_service/db/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (N/A)     | (N/A)      | (N/A)                               |
