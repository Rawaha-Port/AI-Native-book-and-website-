# Data Model: Urdu Content Translation

## Backend Data Model

No new backend database tables or persistent data entities are required for this feature. The translation is performed dynamically and is not stored on the server.

## Client-Side State

The feature will be managed entirely on the client-side within the React components. The necessary state includes:

-   `isTranslated` (boolean): Tracks if the current chapter content is in its original or translated state.
-   `isTranslating` (boolean): Tracks if a translation is currently in progress, used to disable the translation button.
-   `originalContent` (string | null): Stores the original chapter content before translation to allow for reversion.
-   `translatedContent` (string | null): Stores the translated content received from the API.

This state is session-specific and will be reset upon page navigation or reload, aligning with the feature specification.
