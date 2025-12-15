# Quickstart Guide: Urdu Content Translation

This guide provides the high-level steps for a developer to implement the Urdu content translation feature.

## 1. Backend: Translation Proxy Endpoint

**Location**: `chatbot-backend/src/api/`

1.  **Create a new API route**: In the Python backend, create a new file for a `translate` router (e.g., `translate.py`).
2.  **Implement the `/api/translate` endpoint** as defined in `contracts/openapi.yaml`.
3.  **Integrate Google Translate API**: Use the Google Cloud Translation library for Python.
4.  **Secure API Key**: Load the Google Translate API key from environment variables (`.env` file), not from code.
5.  **Add to Main App**: Mount the new `translate` router in the main FastAPI/Flask application file.

## 2. Frontend: Docusaurus Component

### 2.1. Create the `TranslateButton` Component

**Location**: `my-book-website/src/components/TranslateButton/`

1.  **Create a new React component** that will contain the button and the translation logic.
2.  **Authentication Check**: Use the existing `AuthContext` to determine if a user is logged in.
3.  **State Management**: Use `useState` to manage `isTranslated`, `isTranslating`, etc.
4.  **API Call**: On button click, if the user is logged in, call the `/api/translate` endpoint on our backend.
5.  **DOM Manipulation**:
    *   On a successful API response, find the main content area of the Docusaurus page (e.g., an element with a specific class like `markdown`).
    *   Traverse the DOM to identify and collect text from paragraphs, lists, and table cells, ignoring `<code>` blocks.
    *   Replace the inner text of these elements with the translated content. Store the original content in state to allow reversion.
6.  **User Notifications**:
    *   If the user is logged out, display a toast notification.
    *   If the API call fails, display the specified error toast.

### 2.2. Integrate into Docusaurus Layout

1.  **"Swizzle" the Docusaurus Layout**: To add the button to every chapter, we need to customize the default theme. Use the Docusaurus `swizzle` command to get a copy of the component that renders the main content area (e.g., `DocItem`).
2.  **Add the Component**: Import and render the `<TranslateButton />` component at the top of the swizzled component.

## 3. Styling

1.  **Button Style**: Style the button to match the site's existing UI, using Infima CSS classes.
2.  **Toast/Snackbar Style**: Ensure the notification messages for "login required" and "translation failed" are styled consistently with the site's theme.
