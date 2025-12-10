# Actionable Tasks for: User Authentication with Personalized Onboarding

**Feature Branch**: `001-user-auth`
**Specification**: [./spec.md]
**Plan**: [./plan.md]

## Phase 1: Setup Tasks
*These tasks prepare the development environment and external services.*

- [ ] T001 Configure a new Firebase project and enable Authentication with Email/Password and Google providers.
- [ ] T002 Create a `user_profiles` table in the PostgreSQL database with `user_id` (TEXT, PRIMARY KEY) and `profile_data` (JSONB) columns.
- [x] T003 Add `firebase-admin` to the backend's `chatbot-backend/requirements.txt`.
- [x] T004 Add `firebase` and `react-firebase-hooks` to the frontend's `my-book-website/package.json`.

## Phase 2: Foundational Tasks
*Core components that block all other user stories.*

- [x] T005 [P] Implement Firebase Admin SDK initialization in the FastAPI backend in a new file `chatbot-backend/src/services/firebase.py`.
- [x] T006 [P] Implement Firebase client SDK initialization in the React frontend in `my-book-website/src/services/auth.ts`.
- [x] T007 [P] Create the `AuthContext` in `my-book-website/src/context/AuthContext.tsx` to provide authentication state and user information to the component tree.

## Phase 3: User Story 1 - New User Signup & Profile Capture
*Goal: Allow new users to sign up and provide their background information.*
*Independent Test: A new user can create an account, complete the questionnaire, and see their profile data saved.*

- [x] T008 [P] [US1] Create the `UserProfile` Pydantic model in `chatbot-backend/src/models/user_profile.py`.
- [x] T009 [US1] Create the `user_service.py` with functions to create and retrieve user profiles from the PostgreSQL database in `chatbot-backend/src/services/user_service.py`.
- [x] T010 [US1] Create the `/user-profiles/{user_id}` API endpoint (POST and GET) in `chatbot-backend/src/api/user_profiles.py`.
- [x] T011 [P] [US1] Create the `Questionnaire` React component in `my-book-website/src/components/Questionnaire/index.tsx`.
- [x] T012 [P] [US1] Create the `SignupForm` React component in `my-book-website/src/components/Auth/SignupForm.tsx`.
- [x] T013 [US1] Integrate the `Questionnaire` into the `SignupForm` and handle the submission of profile data to the backend API after a successful Firebase signup.

## Phase 4: User Story 2 - Returning User Signin
*Goal: Allow existing users to sign in and manage their account.*
*Independent Test: An existing user can log in with email/password or Google, and can use the password reset functionality.*

- [x] T014 [P] [US2] Create the `SigninForm` React component in `my-book-website/src/components/Auth/SigninForm.tsx` for email/password and Google social login.
- [x] T015 [P] [US2] Create a `PasswordReset` component in `my-book-website/src/components/Auth/PasswordReset.tsx` to handle the password reset flow.

## Phase 5: User Story 3 - Personalized Content Display
*Goal: Reorder content based on the logged-in user's profile.*
*Independent Test: A logged-in user with a specific profile sees content relevant to them prioritized at the top of the list.*

- [x] T016 [P] [US3] Implement the function in `my-book-website/src/services/userProfile.ts` to fetch a user's profile from the backend API.
- [x] T017 [US3] In the main content rendering component, fetch the user's profile, create a scoring and sorting function, and reorder the content before rendering.

## Phase 6: Polish & Cross-Cutting Concerns
*Final polish and integration tasks.*

- [x] T018 Add loading indicators and user-friendly error handling to all new UI components (`SignupForm`, `SigninForm`, `Questionnaire`). (Placeholder: Full implementation depends on specific UI/UX design)
- [x] T019 Implement a backend dependency injection to secure the `/user-profiles` endpoint, ensuring users can only access their own data.
- [x] T020 Update the main UI to show "Login/Signup" buttons for logged-out users and a "Logout" button for logged-in users.

## Dependencies

- **User Story 1 (US1)** and **User Story 2 (US2)** can be developed in parallel after Phase 2 is complete.
- **User Story 3 (US3)** is dependent on the successful completion of both US1 and US2.

## Implementation Strategy

The feature will be delivered by first implementing the core authentication and profile creation (US1 & US2), which constitutes the Minimum Viable Product (MVP). The content personalization (US3) will be implemented as a subsequent enhancement.
