# Research: Authentication and Integration Strategy

**Date**: 2025-12-15
**Feature**: [Better Auth with User Profiling](../spec.md)

This document summarizes the research findings for the technical implementation of the user authentication feature.

## 1. `better-auth.com` API

### Summary
The primary dependency, `better-auth.com`, is a self-hostable, TypeScript-native authentication framework, not a purely external SaaS provider. This has significant architectural implications.

**Decision**: The Better Auth instance will be integrated into and hosted by our existing `chatbot-backend` (Python/FastAPI). While Better Auth is TypeScript-native, its functionality will be exposed via our own backend's API. The backend will interact with a Node.js sub-process or a separate container running the Better Auth server.

**Rationale**: This approach contains the authentication logic within our backend infrastructure, avoiding the need to expose a separate auth service to the frontend. Our FastAPI backend will act as a proxy to the Better Auth service, which aligns with our existing architecture.

### API Usage
Based on the documentation, the interaction will be as follows:

- **Configuration**: An `auth` instance will be configured in the backend to enable `emailAndPassword`.
- **Sign Up**: The backend's `/signup` endpoint will call the server-side `auth.api.signUpEmail` function from the Better Auth instance.
- **Sign In**: The backend's `/signin` endpoint will call `auth.api.signInEmail`.
- **Session Management**: Better Auth handles session creation. The backend will be responsible for receiving the session token (likely a JWT) and passing it to the frontend. The frontend will then store this token for subsequent authenticated requests.

## 2. Docusaurus Integration

### Summary
Docusaurus is built on React. Integrating custom UI and authentication logic requires using React components and lifecycle methods.

**Decision**:
1.  **UI Components**: We will create custom React components for the Signup and Signin forms, as well as a "Profile" page. These components will reside in `my-book-website/src/components/Auth/`.
2.  **State Management**: React's Context API will be used to manage the user's authentication state (e.g., logged in status, user profile data) across the Docusaurus site. A new `AuthContext` will be created.
3.  **Client-Side Routing**: Docusaurus's routing will be used to create pages for `/signup`, `/signin`, and `/profile`.

**Rationale**: This approach uses standard React patterns and integrates cleanly with Docusaurus's "swizzling" and component architecture, ensuring the new functionality feels native to the site.

## 3. Secure Backend Communication

### Summary
Communication between the Docusaurus frontend and the FastAPI backend must be secure, especially when handling credentials and session information.

**Decision**:
- **Authentication Scheme**: JSON Web Tokens (JWT) will be used for session management. Upon successful login via Better Auth, our backend will generate a JWT and send it to the frontend.
- **Token Storage**: The JWT will be stored in an `HttpOnly` cookie to prevent XSS attacks.
- **Authenticated Requests**: All subsequent requests from the frontend to the backend will include this cookie, which the FastAPI backend will validate to identify the user.
- **CORS**: The FastAPI backend will be configured with a CORS policy to only accept requests from the Docusaurus website's domain.

**Rationale**: This is a standard, secure, and stateless approach for handling authentication in modern web applications.
