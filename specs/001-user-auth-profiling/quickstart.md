# Quickstart: User Authentication Setup

**Date**: 2025-12-15
**Feature**: [Better Auth with User Profiling](../spec.md)

This guide provides the essential steps to set up and run the new user authentication and profiling feature.

## 1. Backend Setup

### Prerequisites
- Python 3.11+
- Poetry for dependency management
- Access to a Neon (PostgreSQL) database

### Steps
1.  **Navigate to the backend directory**:
    ```bash
    cd chatbot-backend
    ```
2.  **Install Dependencies**:
    - Add `better-auth` (as a Node.js dependency, managed via a sub-process) and a Python HTTP client to the backend dependencies.
    - `poetry install`
3.  **Configure Environment Variables**:
    - Update the `.env` file with your Neon database connection string and credentials for the `better-auth.com` service.
    ```
    DATABASE_URL="postgresql://..."
    BETTER_AUTH_SECRET="..."
    ```
4.  **Run Database Migrations**:
    - A migration script will be provided to create the `users` and `user_profiles` tables.
    ```bash
    poetry run alembic upgrade head
    ```
5.  **Start the Backend Server**:
    ```bash
    poetry run uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

## 2. Frontend Setup

### Prerequisites
- Node.js LTS
- `pnpm` for package management

### Steps
1.  **Navigate to the frontend directory**:
    ```bash
    cd my-book-website
    ```
2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```
3.  **Implement UI Components**:
    - Create the React components for `SignupForm`, `SigninForm`, and `ProfilePage` under `src/components/Auth/`.
    - Create the `AuthContext` to manage application-wide authentication state.
    - Add the new pages (`/signup`, `/signin`, `/profile`) to the Docusaurus site structure.
4.  **Start the Frontend Development Server**:
    ```bash
    pnpm start
    ```
    The website will be available at `http://localhost:3000`.

## 3. Verification

1.  Navigate to `http://localhost:3000/signup`.
2.  Create a new user account and fill in the profile details.
3.  You should be redirected and logged in.
4.  Navigate to `http://localhost:3000/profile` to verify that your profile information is displayed correctly.
