# Tasks: Better Auth with User Profiling

**Input**: Design documents from `specs/001-user-auth-profiling/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No explicit test tasks are generated as they were not requested. The independent test criteria for each user story should be used for manual validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **backend/**: `chatbot-backend/`
- **frontend/**: `my-book-website/`

---
## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment and dependency configuration for both frontend and backend.

- [ ] T001 [P] In `chatbot-backend/`, add `psycopg2-binary` to handle PostgreSQL connections.
- [ ] T002 [P] In `my-book-website/`, install an HTTP client like `axios` for API communication.
- [ ] T003 In `chatbot-backend/.env`, add placeholders for `DATABASE_URL` and `BETTER_AUTH_SECRET`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 In `chatbot-backend/`, configure a database migration tool (e.g., Alembic) and create an initial migration in `chatbot-backend/migrations/` to generate the `users` and `user_profiles` tables as defined in `data-model.md`.
- [ ] T005 [P] In `my-book-website/src/contexts/`, create the `AuthContext.tsx` to manage global user state (e.g., `isAuthenticated`, `currentUser`).
- [ ] T006 [P] In `chatbot-backend/main.py`, implement CORS middleware to allow requests from `http://localhost:3000`.
- [ ] T007 [P] In `chatbot-backend/src/core/`, create `better_auth_instance.ts` (or equivalent in a Node.js sub-process) to configure and export the self-hosted Better Auth service instance.
- [ ] T008 Implement the core `auth_service.py` in `chatbot-backend/src/services/` to act as a wrapper for interacting with the Better Auth service.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - New User Signup & Profile Creation (Priority: P1) 🎯 MVP

**Goal**: A new user can create an account and submit their technical background, which is saved to the database.

**Independent Test**: Navigate to `/signup`, create a new user, and verify the user and their profile data are correctly stored in the Neon database.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create the signup page file at `my-book-website/src/pages/signup.tsx`.
- [ ] T010 [P] [US1] Create the `SignupForm.tsx` component in `my-book-website/src/components/Auth/` containing fields for email, password, and all user profile questions.
- [ ] T011 [US1] Implement the `POST /api/v1/auth/signup` endpoint in `chatbot-backend/src/api/auth.py`.
- [ ] T012 [US1] In `chatbot-backend/src/services/auth_service.py`, implement the `signup` method to orchestrate creating the user via Better Auth and saving the user and their profile data to the database.
- [ ] T013 [US1] Integrate the `SignupForm.tsx` component into the `my-book-website/src/pages/signup.tsx` page and connect its API calls. On success, update the `AuthContext`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Existing User Signin & Profile Retrieval (Priority: P1)

**Goal**: An existing user can sign in, and their profile data is retrieved from the database.

**Independent Test**: With a pre-existing user, navigate to `/signin`, log in successfully, and confirm the application state (e.g., in `AuthContext`) is correctly populated with the user's profile data.

### Implementation for User Story 2

- [ ] T014 [P] [US2] Create the signin page file at `my-book-website/src/pages/signin.tsx`.
- [ ] T015 [P] [US2] Create the `SigninForm.tsx` component in `my-book-website/src/components/Auth/` with fields for email and password.
- [ ] T016 [US2] Implement the `POST /api/v1/auth/signin` endpoint in `chatbot-backend/src/api/auth.py`.
- [ ] T017 [US2] In `chatbot-backend/src/services/auth_service.py`, implement the `signin` method to authenticate via Better Auth, retrieve the user's profile from the database, and return it.
- [ ] T018 [US2] Integrate `SigninForm.tsx` into `my-book-website/src/pages/signin.tsx`. On successful login, populate the `AuthContext` with the user's data.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - User Profile Update (Priority: P2)

**Goal**: A logged-in user can view and update their technical background information.

**Independent Test**: Log in as an existing user, navigate to the `/profile` page, change a value (e.g., a programming language skill level), save it, and verify the change is persisted by reloading the page.

### Implementation for User Story 3

- [ ] T019 [P] [US3] Create the user profile page at `my-book-website/src/pages/profile.tsx`.
- [ ] T020 [P] [US3] Create a `ProfileForm.tsx` component in `my-book-website/src/components/Auth/` to display and allow editing of the user profile data.
- [ ] T021 [US3] Implement the `GET /api/v1/users/me` and `PUT /api/v1/users/me` endpoints in `chatbot-backend/src/api/auth.py`.
- [ ] T022 [US3] In `chatbot-backend/src/services/auth_service.py`, implement the `get_profile` and `update_profile` methods.
- [ ] T023 [US3] Integrate `ProfileForm.tsx` into `my-book-website/src/pages/profile.tsx`, populating it with data from the `AuthContext` and calling the PUT endpoint on save.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall user experience.

- [ ] T024 Review Docusaurus layouts to ensure book content in `my-book-website/docs/` remains public and accessible without login, as per requirement FR-009.
- [ ] T025 [P] Implement loading indicators in all auth forms in `my-book-website/src/components/Auth/`.
- [ ] T026 [P] Implement user-friendly error message displays for API failures in all auth forms in `my-book-website/src/components/Auth/`.
- [ ] T027 Implement a "Sign Out" button (e.g., in the navbar) that clears the `AuthContext` and session cookies.

---
## Dependencies & Execution Order

### Phase Dependencies
- **Foundational (Phase 2)** depends on **Setup (Phase 1)**.
- **User Stories (Phases 3, 4, 5)** depend on **Foundational (Phase 2)**.
- **Polish (Phase 6)** depends on all user stories being complete.

### User Story Dependencies
- **User Story 1 (Signup)**: No dependencies on other stories.
- **User Story 2 (Signin)**: No dependencies on other stories.
- **User Story 3 (Profile Update)**: Depends on a user being logged in (US2).

### Parallel Opportunities
- Once Phase 2 is complete, work on US1 and US2 can begin in parallel.
- Within each user story, frontend page/component creation can happen in parallel with backend endpoint creation.
- For example, T009/T010 (frontend signup) can be done in parallel with T011/T012 (backend signup).

---
## Implementation Strategy

### MVP First (User Stories 1 & 2)
1. Complete Phase 1 & 2.
2. Complete Phase 3 (US1 - Signup) and Phase 4 (US2 - Signin).
3. **STOP and VALIDATE**: A user can sign up, their data is saved, they can sign out, and they can sign back in to retrieve their data. This is the core auth loop.

### Incremental Delivery
1. Deliver the MVP (Signup/Signin).
2. Add User Story 3 (Profile Update) and deploy.
3. Add Polish items.
