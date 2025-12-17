# Implementation Plan: Better Auth with User Profiling

**Branch**: `001-user-auth-profiling` | **Date**: 2025-12-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-user-auth-profiling/spec.md`

## Summary

This plan outlines the implementation of a user authentication and profiling system. It will use `better-auth.com` for authentication, hosted within the backend. New users will be onboarded with questions about their technical background, and this data will be stored in a Neon (PostgreSQL) database. The user interface will be integrated into the existing Docusaurus frontend.

## Technical Context

**Language/Version**: Python 3.11, TypeScript (for Docusaurus and Better Auth)
**Primary Dependencies**: FastAPI, Docusaurus, React, Neon (PostgreSQL), better-auth.com
**Storage**: Neon (PostgreSQL)
**Testing**: Pytest, Jest/React Testing Library
**Target Platform**: Web
**Project Type**: Web application (frontend/backend)
**Performance Goals**: User profile data retrieval under 500ms.
**Constraints**: Integration must feel native to the Docusaurus site.
**Scale/Scope**: ~10k users.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Content First**: The plan supports the main content by enabling user-specific experiences in the future.
- [x] **Docusaurus for Structure**: The plan integrates directly into the existing Docusaurus site using standard React practices.
- [x] **Markdown as the Source**: This feature does not alter the core content, which remains in Markdown.
- [x] **Living Document**: The user profile can be updated, aligning with the principle of living, updated content.
- [x] **Automated Checks**: The plan assumes testing frameworks (Pytest, Jest) will be used to maintain quality.
- [x] **Clear and Concise Language**: N/A to this feature's implementation plan.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-auth-profiling/
├── plan.md              # This file
├── research.md          # Research on better-auth.com and Docusaurus integration
├── data-model.md        # Database schema for users and user_profiles
├── quickstart.md        # Setup guide for this feature
└── contracts/           # API contract
    └── openapi.yaml
```

### Source Code (repository root)

```text
backend/ (chatbot-backend)
├── src/
│   ├── api/
│   │   └── auth.py        # New: Endpoints for signup, signin, profile
│   ├── services/
│   │   └── auth_service.py # New: Business logic for auth, interacts with better-auth
│   └── core/
│       └── better_auth_instance.ts # New: Self-hosted better-auth configuration
└── tests/

frontend/ (my-book-website)
├── src/
│   ├── components/
│   │   └── Auth/          # New: SignupForm, SigninForm, ProfilePage components
│   ├── contexts/
│   │   └── AuthContext.tsx # New: Manages user session state
│   └── pages/
│       ├── signup.tsx     # New
│       ├── signin.tsx     # New
│       └── profile.tsx    # New
└── tests/
```

**Structure Decision**: The plan utilizes the existing `backend` and `frontend` project structure. New functionality will be added in dedicated modules/components within these structures to ensure clear separation of concerns.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None* | | |