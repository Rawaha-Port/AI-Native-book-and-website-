# Tasks: Urdu Content Translation (File-Based)

**Input**: Design documents from `/specs/002-urdu-translation-feature/`
**Prerequisites**: plan.md, spec.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: Which user story this task belongs to (US1, US2)

## Phase 1: Content Generation (Blocking Prerequisite)

**Purpose**: Create the pre-translated Urdu markdown files.

- [x] T001 [P] Translate `my-book-website/docs/bibliography.md` and save as `my-book-website/docs/bibliography.ur.md`.
- [x] T002 [P] Translate `my-book-website/docs/chapter-1.md` and save as `my-book-website/docs/chapter-1.ur.md`.
- [x] T003 [P] Translate `my-book-website/docs/chapter-2.md` and save as `my-book-website/docs/chapter-2.ur.md`.
- [x] T004 [P] Translate `my-book-website/docs/chapter-3.md` and save as `my-book-website/docs/chapter-3.ur.md`.
- [x] T005 [P] Translate `my-book-website/docs/chapter-4.md` and save as `my-book-website/docs/chapter-4.ur.md`.
- [x] T006 [P] Translate `my-book-website/docs/chapter-5.md` and save as `my-book-website/docs/chapter-5.ur.md`.
- [x] T007 [P] Translate `my-book-website/docs/chapter-6.md` and save as `my-book-website/docs/chapter-6.ur.md`.
- [x] T008 [P] Translate `my-book-website/docs/chapter-7.md` and save as `my-book-website/docs/chapter-7.ur.md`.
- [x] T009 [P] Translate `my-book-website/docs/glossary.md` and save as `my-book-website/docs/glossary.ur.md`.
- [x] T010 [P] Translate `my-book-website/docs/preface.md` and save as `my-book-website/docs/preface.ur.md`.
- [x] T011 [P] Translate `my-book-website/docs/table-of-contents.md` and save as `my-book-website/docs/table-of-contents.ur.md`.

---

## Phase 2: Foundational Frontend

**Purpose**: Create the frontend component structure.

- [x] T012 [P] Create the directory `my-book-website/src/components/TranslateButton/`.
- [x] T013 Create the basic `TranslateButton` component file `my-book-website/src/components/TranslateButton/index.tsx`.
- [x] T014 [P] Create the stylesheet for the button `my-book-website/src/components/TranslateButton/styles.module.css`.
- [x] T015 Use Docusaurus swizzle command to get a copy of `DocItem/Content` at `my-book-website/src/theme/DocItem/Content/index.tsx`.
- [x] T016 Import and place the placeholder `TranslateButton` component within `my-book-website/src/theme/DocItem/Content/index.tsx`.

---

## Phase 3: User Story 2 - Logged-Out User Notification

**Goal**: Inform non-logged-in users that translation is a members-only feature.
**Independent Test**: As a logged-out user, clicking the "Translate to Urdu" button shows a "You need to log in first" message, which then fades out.

- [x] T017 [US2] In `my-book-website/src/components/TranslateButton/index.tsx`, import and use the `useAuth` hook from `my-book-website/src/contexts/AuthContext.tsx`.
- [x] T018 [US2] Implement the `onClick` handler. If the user is not authenticated, trigger a toast notification with the message "You need to log in first".
- [x] T019 [US2] Ensure a toast notification provider is available in the site's layout, or add one if necessary.

---

## Phase 4: User Story 1 - Show Pre-translated Content

**Goal**: Allow logged-in users to view the pre-translated Urdu content.
**Independent Test**: As a logged-in user, clicking "Translate to Urdu" replaces the page content with the content from the `.ur.md` file. Clicking "Show Original" reverts it.

- [x] T020 [US1] In `my-book-website/src/components/TranslateButton/index.tsx`, add state to manage the translated content and visibility: `isTranslated`, `isLoading`, `translatedHtml`.
- [x] T021 [US1] In the `onClick` handler, if the user is authenticated, determine the path of the current page and construct the path to the corresponding `.ur.md` file.
- [x] T022 [US1] Implement the logic to fetch the content of the `.ur.md` file.
- [x] T023 [US1] On successful fetch, use a markdown-to-HTML library or a React component to render the fetched markdown content. Store the original content to allow for reversion.
- [x] T024 [US1] Implement the dynamic content swapping, replacing the original content with the rendered HTML from the Urdu file. Add a fade-in/fade-out animation for a smooth transition.
- [x] T025 [US1] Update the button text to "Show Original" when `isTranslated` is true. Implement the logic to revert to the original content when the button is clicked again.
- [x] T026 [US1] Implement the `isLoading` state to disable the button while content is being fetched and rendered.
- [x] T027 [US1] Implement error handling to show the "Translation not available for this chapter." toast notification if the `.ur.md` file fails to load.

---

## Phase 5: Polish

**Purpose**: Final styling and code cleanup.

- [x] T028 [P] Apply styles from `styles.module.css` to the button.
- [x] T029 [P] Ensure toast notifications are styled consistently.
- [x] T030 Refactor and clean up code in all new files.

---

## Dependencies & Execution Order

- **Phase 1 (Content Generation)** is a prerequisite for the entire feature to work.
- **Phase 2 (Foundational)** must be complete before starting Phases 3 and 4.
- **Phases 3 (US2) and 4 (US1)** can be worked on in parallel after Phase 2.
- **Phase 5 (Polish)** can begin after Phases 3 and 4 are complete.